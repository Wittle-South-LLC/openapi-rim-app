/* RimTestGenerator.js - Generates Mocha tests for generated RIM objects */
import BaseModelGenerator from './BaseModelGenerator'

export default class RimTestGenerator extends BaseModelGenerator {
  constructor(config, modelObject) {
    super (modelObject,
      config['TEMPLATES']['PATH'] + '/' + config['TEMPLATES']['MOCHA'],
      config['APP']['TEST_PATH'] + '/test-state-' + modelObject._name + '.js')
    this._sections = ['getterTests', 'validTests', 'invalidTests']
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

  getValidTest(prop) {
    return `it ('is${prop.getMixedName()}Valid() returns true for valid ${prop.getMixedName()}', () => {\n` +
           `    chai.expect(testObj.is${prop.getMixedName()}Valid()).to.equal(true)\n  })`
  }

  getInvalidTest(prop) {
    return `it ('is${prop.getMixedName()}Valid() returns false for invalid ${prop.getMixedName()}', () => {\n` +
           `    const invalidObj = testObj.updateField(TCLASS._${prop.getMixedName()}Key, ${prop.getInvalidValue()})\n` +
           `    chai.expect(invalidObj.is${prop.getMixedName()}Valid()).to.equal(false)\n  })`
  }

  getInitialContext() {
    const result = super.getInitialContext()
    result['exampleId'] = this._modelObject.getIdProperty().exampleValue()
    this._sections.forEach((key) => {
      result[key] = []
    })
    return result
  }

  processProperty(context, prop) {
    context['getterTests'].push(this.getGetterTest(prop))
    if (prop.needsValidation()) {
      context['validTests'].push(this.getValidTest(prop))
      context['invalidTests'].push(this.getInvalidTest(prop))
    }
    return context
  }
}
