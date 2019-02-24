/* RimTestGenerator.js - Generates Mocha tests for generated RIM objects */
import BaseModelGenerator from './BaseModelGenerator'

export default class RimTestGenerator extends BaseModelGenerator {
  constructor(config, modelObject) {
    super (modelObject,
      config['paths']['templates'] + '/' + config['templates']['tests'],
      config['paths']['tests'] + '/test-state-' + modelObject._name + '.js')
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
    let result = `it ('get${prop.getMixedName()}() returns ${this._name}._${prop.getMixedName()}Key', () => {\n`+
                 `    chai.expect(testObj.get${prop.getMixedName()}()${transform}).to.${check}(${prop.exampleValue()})` +
                 '\n  })'
    if (prop.type === 'string' && prop.format === 'date') {
      result += `\n  it ('get${prop.getMixedName()}String() returns ${this._name}._${prop.getMixedName()}Key as LocaleString', () => {\n`+
                 `    chai.expect(testObj.get${prop.getMixedName()}String()).to.equal(new Date(${prop.exampleValue()}).toLocaleString())` +
                 '\n  })'
    }
    return result
  }

  getValidTest(prop) {
    return `it ('is${prop.getMixedName()}Valid() returns true for valid ${prop.getMixedName()}', () => {\n` +
           `    chai.expect(testObj.is${prop.getMixedName()}Valid()).to.equal(true)\n  })`
  }

  getInvalidTest(prop) {
    return `it ('is${prop.getMixedName()}Valid() returns false for invalid ${prop.getMixedName()}', () => {\n` +
           `    const invalidObj = testObj.updateField(TCLASS._${prop.getMixedName()}Key, ${prop.getInvalidValue()})\n` +
           `    chai.expect(invalidObj.isValid()).to.equal(false)\n` +
           `    chai.expect(invalidObj.is${prop.getMixedName()}Valid()).to.equal(false)\n  })`
  }

  getCreatePayloadTest() {
    const myProperties = this._modelObject.getAllProperties()
    const resultObj = {}
    for (let propName in myProperties) {
      const prop = myProperties[propName]
      if (!prop.readOnly) {
        resultObj[prop.name] = prop.example ? prop.example : null
      }
    }
    return `it ('getCreatePayload() returns correct payload', () => {\n` +
           `    chai.expect(testObj.getCreatePayload()).to.eql(${JSON.stringify(resultObj)})\n  })`
  }

  getUpdatePayloadTest() {
    const myProperties = this._modelObject.getAllProperties()
    const resultObj = {}
    for (let propName in myProperties) {
      const prop = myProperties[propName]
      if (!prop.readOnly && !prop.createOnly) {
        resultObj[prop.name] = prop.example ? prop.example : null
      }
    }
    return `it ('getUpdatePayload() returns correct payload', () => {\n` +
           `    chai.expect(testObj.getUpdatePayload()).to.eql(${JSON.stringify(resultObj)})\n  })`
  }

  getInitialContext() {
    const result = super.getInitialContext()
    if (this._modelObject.getIdProperty())
      result['exampleId'] = this._modelObject.getIdProperty().exampleValue()
    result['getCreatePayload'] = this.getCreatePayloadTest()
    result['getUpdatePayload'] = this.getUpdatePayloadTest()
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
