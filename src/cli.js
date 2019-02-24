#!/usr/bin/env node
var fs = require('fs')                          // Necessary to read file from OS
var yaml = require('js-yaml')                   // Necessary to parse spec YAML
var packageJson = require(process.cwd() + '/package.json')    // Obtain configuration from package.json
import { Schema, schemaService } from './Schema'
import { ModelObject, modelObjectService } from './ModelObject'
import OrimObjectGenerator from './OrimObjectGenerator'
import OrimServiceGenerator from './OrimServiceGenerator'
import StateObjectGenerator from './StateObjectGenerator'
import RimTestGenerator from './RimTestGenerator'
import TestDataGenerator from './TestDataGenerator'

// The spec file name is expected to be provided in the package.json file
// for the project that is using this module
const filename = packageJson['openapi-rim-app']['spec']
if (!filename) {
  console.log('ERROR: No specification file in package.json')
  process.exit(1)
}
console.log(`Reading OpenAPI specification from: ${filename}`)
var doc = yaml.safeLoad(fs.readFileSync(filename, 'utf8'))
if (!doc) {
  console.log(`ERROR: Unable to read ${filename} as YAML`)
  process.exit(1)
}
if (doc.openapi.charAt(0) !== '3') {
  console.log('ERROR: OpenAPI specification is not 3.X, only 3.X is supported')
  process.exit(1)
}
console.log(`Title: ${doc.info.title}`)

// Create a config object from what is specified in config.json
const config = packageJson['openapi-rim-app']
if (!config['paths']) {
  console.log('ERROR: Package.json file does not contain openapi-rim-app paths')
  process.exit(1)
}
if (!config['paths']['templates']) {
  console.log('ERROR: No openapi-rim-app template path in Package.json')
  process.exit(1)
}
if (!config['paths']['tests']) {
  console.log('ERROR: No openapi-rim-app tests path in Package.json')
  process.exit(1)
}
if (!config['paths']['stateObjects']) {
  console.log('ERROR: No openapi-rim-app stateObjects path in Package.json')
  process.exit(1)
}
if (!config['templates']) config['templates'] = {}
if (!config['templates']['stateObjects']) config['templates']['stateObjects'] = 'StateObject.mu'
if (!config['templates']['orimObjects']) config['templates']['orimObjects'] = 'OrimObject.mu'
if (!config['templates']['tests']) config['templates']['tests'] = 'MochaTest.mu'
if (!config['templates']['services']) config['templates']['services'] = 'OrimServices.mu'
if (!config['templates']['testData']) config['templates']['testData'] = 'TestData.mu'

// Process the spec to identify schemas
for (var schema in doc.components.schemas) {
  var mySchema = new Schema(schema, doc.components.schemas[schema])
  if (mySchema.identityObject) {
    let objectName = mySchema.identityObject
    const myModelObject = modelObjectService[objectName] ? modelObjectService[objectName] : new ModelObject(objectName, mySchema.description)
    myModelObject.setIdentitySchema(mySchema)
  }
  if (mySchema.updateObject) {
    let objectName = mySchema.updateObject
    const myModelObject = modelObjectService[objectName] ? modelObjectService[objectName] : new ModelObject(objectName, mySchema.description)
    myModelObject.setUpdateSchema(mySchema)
  }
}

// For each model object, generate the model object specific source files
for (var objectName in modelObjectService) {
  console.log(`Generating source for model object ${objectName}: `)
  const stateGenerator = new StateObjectGenerator(config, modelObjectService[objectName])
  stateGenerator.render()
  const generator = new OrimObjectGenerator(config, modelObjectService[objectName])
  generator.render()
  const testGenerator = new RimTestGenerator(config, modelObjectService[objectName])
  testGenerator.render()
}

// Generate singleton source files (only one regardless of schema count)
console.log('Generating shared source files')
const testDataGen = new TestDataGenerator(config, modelObjectService)
testDataGen.render()
const serviceGen = new OrimServiceGenerator(config, modelObjectService)
serviceGen.render()

console.log('openapi-rim-app source generation complete')
