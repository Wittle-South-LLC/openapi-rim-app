#!/usr/bin/env node
var fs = require('fs')                          // Necessary to read file from OS
var yaml = require('js-yaml')                   // Necessary to parse spec YAML
var packageJson = require('../package.json')    // Obtain configuration from package.json
var config = require('../src/config.json')      // Read configuration as an object
import Schema from './Schema'
import ModelObject from './ModelObject'
import RimObjectGenerator from './RimObjectGenerator'

console.log("Hello World!")
// console.log('Package.json = ', packageJson)

const filename = packageJson['openapi-rim-app']['spec']
console.log(`Filename: ${filename}`)
var doc = yaml.safeLoad(fs.readFileSync(filename, 'utf8'))
console.log(`Title: ${doc.info.title}`)
var mySchemas = {}
var modelObjects = {}
for (var schema in doc.components.schemas) {
  if (!doc.components.schemas.hasOwnProperty(schema)) continue
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

for (var objectName in modelObjects) {
  console.log(`Handling ${objectName}: `)
  const generator = new RimObjectGenerator(config, modelObjects[objectName])
  generator.render()
}
// console.log('Schemas: ', JSON.stringify(mySchemas, null, 2))
