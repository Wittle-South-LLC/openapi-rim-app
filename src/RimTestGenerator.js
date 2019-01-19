/* RimTestGenerator.js - Generates Mocha tests for generated RIM objects */

import Handlebars from 'handlebars'
var fs = require('fs')

export default class RimTestGenerator {
  constructor(config, modelObject) {
    this._config = config
    this._modelObject = modelObject
    this._name = modelObject._name
  }

  getGetterTest(prop) {
    let transform = ""
    let check = "equal"
    if (prop.type === 'object') {
      transform = ".toJS()"
      check = "eql"
    } else if (prop.type === 'string' && prop.format === 'date') {
      transform = ".toJSON()"
    }
    return `it ('get${prop.getMixedName()}() returns ${this._name}._${prop.getMixedName()}Key', () => {\n`+
           `    chai.expect(testObj.get${prop.getMixedName()}()${transform}).to.${check}(${prop.exampleValue()})` +
           '\n  })'
  }

  // Create the dictionary that will be passed to the moustache template to generate the source file
  getTemplateContext() {
    // Create the empty results object
    const result = {
      'name': this._name,
      'getterTests': [],
      'validTests': [],
      'invalidTests': []
    }    
    // Loop through the properties and populate the object
    const propertyList = this._modelObject.getAllProperties()
    for (var propName in propertyList) {
      const prop = propertyList[propName]
      result['getterTests'].push(this.getGetterTest(prop))
    }
    return result
  }

  // Create the test script from the template script
  render() {
    const template = Handlebars.compile(fs.readFileSync(this._config['TEMPLATES']['PATH'] + '/' + this._config['TEMPLATES']['MOCHA'], 'utf8'))
    const result = template(this.getTemplateContext())
    fs.writeFileSync(this._config['APP']['TEST_PATH'] + '/test-state-' + this._name + '.js', result)
  }
}
