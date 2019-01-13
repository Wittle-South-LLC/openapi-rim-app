/* RimObjectGenerator.js - Generates redux-immutable-model objects */
import Handlebars from 'handlebars'
var fs = require('fs')

export default class RimObjectGenerator {
  constructor(config, modelObject) {
    this._config = config
    this._modelObject = modelObject
    this._name = modelObject._name
  }

  // Generates the class static constants representing field names in JSON payload
  getFieldConstant(prop) {
    return `static ${prop.getUpperName()} = '${prop.name}'`
  }

  // Generates statement to set default value for the property for new instances
  getDefaultValue(prop) {
    if (prop.getUpperName() === 'ID')
      return `this.data = Map({[${this._name}.ID]: ${this._name}.NEW_ID,`
    else
      return `            [${this._name}.${prop.getUpperName()}]: ${prop.defaultValue()},`
  }

  // Generates the getter function for the property
  getGetter(prop) {
    let result = `get${prop.getMixedName()} () { return this.data.get(${this._name}.${prop.getUpperName()}) }`
    if (prop.type === 'string' && prop.format === 'date')
      result += `\n  get${prop.getMixedName()}String () { return this.data.get(${this._name}.${prop.getUpperName()}).toLocaleString() }`
    return result
  }

  // Generates the validator function for the property
  getValidator(prop) {
    const getter = `get${prop.getMixedName()}()`
    let resultConditions = []
    if (prop.minLength)
      resultConditions.push(`this.${getter}.length >= ${prop.minLength}`)
    if (prop.maxLength)
      resultConditions.push(`this.${getter}.length <= ${prop.maxLength}`)
    if (prop.enum)
      resultConditions.push(`['${prop.enum.join("','")}'].includes(this.${getter})`)
    if (prop.pattern)
      resultConditions.push(`${prop.name}Test.test(this.${getter})`)
    let result = ''
    if (!prop.nullable) {
      result = `this.${getter} !== undefined`
      if (resultConditions.length > 0) {
        result += " &&\n            "
        result += resultConditions.join(" &&\n          ")
      }
    } else {
      result += resultConditions.join(" &&\n          ")
      if (resultConditions.length > 0)
        result += ` ||\n          this.${getter} === undefined`
    }
    return `is${prop.getMixedName()}Valid () { return ${result} }`
  }

  // Generates payload element code for the property
  getPayloadElement(prop) {
    let transform = ""
    if (prop.type === 'object') transform = ".toJS()"
    else if (prop.type === 'string' && prop.format === 'date') transform = ".toJSON()"
    return `[${this._name}.${prop.getUpperName()}]: this.get${prop.getMixedName()}()${transform},`
  }

  // Generates property validation call for new object validity test
  getNewValidation(prop) {
    return `if (!this.is${prop.getMixedName()}Valid()) { return ${this._name}.msgs.invalid${prop.getMixedName()}Message }`
  }

  // Generates input transformation code for reading response payloads
  getInputTransform(prop) {
    return `this.data = this.data.set(${this._name}.${prop.getUpperName()}, new Date(paramObj[${this._name}.${prop.getUpperName()}]))`
  }

  // Generates code to remove create-only fields from payload
  getCreateOnly(prop) {
    return `delete payload.${prop.name}`
  }

  // Generates code to create a regular express test for any strings with pattern specified
  getPatternDef(prop) {
    return `const ${prop.name}Test = ${prop.pattern}`
  }

  // Create the dictionary that will be passed to the moustache template to generate the source file
  getTemplateContext() {
    // Create the top level keys in the dictionary
    const result = {
      'name': this._name,
      'desc': this._modelObject._description,
      'varnames': [],
      'defvals': [],
      'getters': [],
      'validators': [],
      'payloads': [],
      'newvalids': [],
      'transforms': [],
      'createOnlys': [],
      'patterns': []
    }
    // Loop through the properties and populate the object
    const propertyList = this._modelObject.getAllProperties()
    for (var propName in propertyList) {
      const prop = propertyList[propName]
      result['varnames'].push(this.getFieldConstant(prop))
      result['defvals'].push(this.getDefaultValue(prop))
      result['getters'].push(this.getGetter(prop))
      if (prop.needsInputTransform()) result['transforms'].push(this.getInputTransform(prop))
      if (prop.needsValidation()) {
        result['validators'].push(this.getValidator(prop))
        result['newvalids'].push(this.getNewValidation(prop))
      }
      if (prop.getUpperName() != 'ID') result['payloads'].push(this.getPayloadElement(prop))
      if (prop.createOnly) result['createOnlys'].push(this.getCreateOnly(prop))
      if (prop.pattern) result['patterns'].push(this.getPatternDef(prop))
    }
    // Default values last element needs to not have trailing commna, and have object and function close
    result['defvals'][result['defvals'].length-1] = result['defvals'][result['defvals'].length-1].slice(0, -1) + "})"
    // Payloads value list needs to not have a trailing comma
    result['payloads'][result['payloads'].length-1] = result['payloads'][result['payloads'].length-1].slice(0, -1)
    return result
  }

  render() {
    const template = Handlebars.compile(fs.readFileSync(this._config['TEMPLATES']['PATH'] + '/' + this._config['TEMPLATES']['RIM_OBJECT'], 'utf8'))
    const result = template(this.getTemplateContext())
    fs.writeFileSync(this._config['APP']['RIM_OBJECT_PATH'] + '/' + this._name + '.js', result)
  }
}