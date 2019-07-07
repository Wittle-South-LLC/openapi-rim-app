/* TestDataGenerator.js - Generates test data for Mocha unit tests */
import BaseSingleGenerator from './BaseSingleGenerator'

export default class TestDataGenerator extends BaseSingleGenerator {
  constructor(config, modelObjects) {
    super (modelObjects,
      config['paths']['templates'] + '/' + config['templates']['testData'],
      config['paths']['tests'] + '/TestData.js')
    this._sections = ['testData']
  }

  // Construct the test data object for the given model
  getTestData(model) {
    let result = `${model._name}s: [{\n`
    const propertyList = model.getAllProperties()
    let propCount = 0
    for (var propName in propertyList) {
      const prop = propertyList[propName]
      // See Issue #35 - We need to emit test data for write-only fields.
//      if (prop.writeOnly) continue
      propCount > 0
        ? result += `,\n    ${prop.name}: ${prop.exampleValue()}`
        : result += `    ${prop.name}: ${prop.exampleValue()}`
      propCount++
    }
    result += '\n  }],'
    return result
  }

  // Initializes context with an empty array for each section
  getInitialContext() {
    const result = super.getInitialContext()
    this._sections.forEach((key) => {
      result[key] = []
    })
    return result
  }

  finalizeContext(context) {
    // testData value list needs to not have a trailing comma
    context['testData'][context['testData'].length-1] = context['testData'][context['testData'].length-1].slice(0, -1)
    return context
  }

  // Adds to each section as needed for the given model
  processModel(context, model) {
    context['testData'].push(this.getTestData(model))
    return context
  }
}