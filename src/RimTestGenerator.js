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
    return context
  }
}
