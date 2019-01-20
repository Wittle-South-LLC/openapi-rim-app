#!/usr/bin/env node
var fs = require('fs')                          // Necessary to read file from OS
var yaml = require('js-yaml')                   // Necessary to parse spec YAML
var packageJson = require('../package.json')    // Obtain configuration from package.json
var config = require('../src/config.json')      // Read configuration as an object
import Schema from './Schema'
import ModelObject from './ModelObject'
import OrimObjectGenerator from './OrimObjectGenerator'
import OrimServiceGenerator from './OrimServiceGenerator'
import StateObjectGenerator from './StateObjectGenerator'
import RimTestGenerator from './RimTestGenerator'
import TestDataGenerator from './TestDataGenerator'

const filename = packageJson['openapi-rim-app']['spec']
console.log(`Filename: ${filename}`)
var doc = yaml.safeLoad(fs.readFileSync(filename, 'utf8'))
console.log(`Title: ${doc.info.title}`)
var mySchemas = {}
var modelObjects = {}
for (var schema in doc.components.schemas) {
  mySchemas[schema] = new Schema(schema, doc.components.schemas[schema])
  if (mySchemas[schema].identityObject) {
    let objectName = mySchemas[schema].identityObject
    if (!modelObjects[objectName])
      modelObjects[objectName] = new ModelObject(objectName, mySchemas[schema].description)
    modelObjects[objectName].setIdentitySchema(mySchemas[schema])
  }
  if (mySchemas[schema].updateObject) {
    let objectName = mySchemas[schema].updateObject
    if (!modelObjects[objectName])
      modelObjects[objectName] = new ModelObject(objectName, mySchemas[schema].description)
    modelObjects[objectName].setUpdateSchema(mySchemas[schema])
  }
}

// Generate singles
const testDataGen = new TestDataGenerator(config, modelObjects)
testDataGen.render()
const serviceGen = new OrimServiceGenerator(config, modelObjects)
serviceGen.render()

for (var objectName in modelObjects) {
  console.log(`Handling ${objectName}: `)
  const stateGenerator = new StateObjectGenerator(config, modelObjects[objectName])
  stateGenerator.render()
  const generator = new OrimObjectGenerator(config, modelObjects[objectName])
  generator.render()
  const testGenerator = new RimTestGenerator(config, modelObjects[objectName])
  testGenerator.render()
}
// console.log('Schemas: ', JSON.stringify(mySchemas, null, 2))
