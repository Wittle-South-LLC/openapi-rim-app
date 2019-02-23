#!/usr/bin/env node
var fs = require('fs')                          // Necessary to read file from OS
var yaml = require('js-yaml')                   // Necessary to parse spec YAML
var packageJson = require('../package.json')    // Obtain configuration from package.json
var config = require('../src/config.json')      // Read configuration as an object
import { Schema, schemaService } from './Schema'
import { ModelObject, modelObjectService } from './ModelObject'
import OrimObjectGenerator from './OrimObjectGenerator'
import OrimServiceGenerator from './OrimServiceGenerator'
import StateObjectGenerator from './StateObjectGenerator'
import RimTestGenerator from './RimTestGenerator'
import TestDataGenerator from './TestDataGenerator'

const filename = packageJson['openapi-rim-app']['spec']
console.log(`Filename: ${filename}`)
var doc = yaml.safeLoad(fs.readFileSync(filename, 'utf8'))
console.log(`Title: ${doc.info.title}`)
for (var schema in doc.components.schemas) {
  var mySchema = new Schema(schema, doc.components.schemas[schema])
  if (mySchema.identityObject) {
    let objectName = mySchema.identityObject
    const myModelObject = modelObjectService[objectName] ? modelObjectService[objectName] : new ModelObject(objectName, mySchema.description)
    console.log(`Setting identity schema for mo ${objectName} to ${mySchema.name}`)
    myModelObject.setIdentitySchema(mySchema)
  }
  if (mySchema.updateObject) {
    let objectName = mySchema.updateObject
    const myModelObject = modelObjectService[objectName] ? modelObjectService[objectName] : new ModelObject(objectName, mySchema.description)
    console.log(`Setting update schema for mo ${objectName} to ${mySchema.name}`)
    myModelObject.setUpdateSchema(mySchema)
  }
}

for (var objectName in modelObjectService) {
  console.log(`${objectName} details: \n`, modelObjectService[objectName])
}

// Generate singles
const testDataGen = new TestDataGenerator(config, modelObjectService)
testDataGen.render()
const serviceGen = new OrimServiceGenerator(config, modelObjectService)
serviceGen.render()

for (var objectName in modelObjectService) {
  console.log(`Handling ${objectName}: `)
  const stateGenerator = new StateObjectGenerator(config, modelObjectService[objectName])
  stateGenerator.render()
  const generator = new OrimObjectGenerator(config, modelObjectService[objectName])
  generator.render()
  const testGenerator = new RimTestGenerator(config, modelObjectService[objectName])
  testGenerator.render()
}
// console.log('Schemas: ', JSON.stringify(mySchemas, null, 2))
