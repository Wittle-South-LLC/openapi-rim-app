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
    var propName = prop.isId ? this._modelObject.getIdentityName(prop) : prop.getMixedName()
    return `it ('is${propName}Valid() returns true for valid ${propName}', () => {\n` +
           `    chai.expect(testObj.is${propName}Valid()).to.equal(true)\n  })`
  }

  getInvalidTest(prop) {
    var propName = prop.isId ? this._modelObject.getIdentityName(prop) : prop.getMixedName()
    return `it ('is${propName}Valid() returns false for invalid ${propName}', () => {\n` +
           `    const invalidObj = testObj.updateField(TCLASS._${propName}Key, ${prop.getInvalidValue()})\n` +
           `    chai.expect(invalidObj.isValid()).to.equal(false)\n` +
           `    chai.expect(invalidObj.is${propName}Valid()).to.equal(false)\n  })`
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
    return `it ('getFetchPayload(SAVE_NEW) returns correct payload', () => {\n` +
           `    chai.expect(testObj.getFetchPayload(defaultVerbs.SAVE_NEW)).to.eql(${JSON.stringify(resultObj)})\n  })`
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
    return `it ('getFetchPayload(SAVE_UPDATE) returns correct payload', () => {\n` +
           `    chai.expect(testObj.getFetchPayload(defaultVerbs.SAVE_UPDATE)).to.eql(${JSON.stringify(resultObj)})\n  })`
  }

  //TODO: Need to have exampleId set correctly for relationship objects
  getInitialContext() {
    const result = super.getInitialContext()
    if (this._modelObject.getIdProperty())
      result['exampleId'] = this._modelObject.getExampleId()
    result['hasName'] = this._modelObject._properties['name'] ? true : false
    result['getCreatePayload'] = this.getCreatePayloadTest()
    result['getUpdatePayload'] = this.getUpdatePayloadTest()
    this._sections.forEach((key) => {
      result[key] = []
    })
    return result
  }

  processProperty(context, prop) {
    if (!prop.isId) {
      context['getterTests'].push(this.getGetterTest(prop))
    }
    if (prop.needsValidation()) {
      context['validTests'].push(this.getValidTest(prop))
      context['invalidTests'].push(this.getInvalidTest(prop))
    }
    return context
  }
}
