/* OrimObjectGenerator.js - Generates redux-immutable-model objects */
import BaseModelGenerator from './BaseModelGenerator'

export default class OrimObjectGenerator extends BaseModelGenerator {
  constructor(config, modelObject) {
    super (modelObject,
      config['paths']['templates'] + '/' + config['templates']['orimObjects'],
      config['paths']['stateObjects'] + '/orim/Orim' + modelObject._name + '.js')
    this._sections = ['varnames', 'defvals', 'getters', 'transforms', 'validators',
                      'payloads', 'valids', 'createOnlys', 'patterns']
    this._name = 'Orim' + modelObject._name
    this.getFieldConstant = this.getFieldConstant.bind(this)
  }

  // Generates the class static constants representing field names in JSON payload
  getFieldConstant(prop) {
    return `static _${prop.getMixedName(this._modelObject)}Key = '${prop.name}'`
  }

  // Generates statement to set default value for the property for new instances
  getDefaultValue(prop) {
    if (prop.isId)
      return `[${this._name}._IdentityKey]: ${this._name}._NewID,`
    else
      return `             [${this._name}._${prop.getMixedName()}Key]: ${prop.defaultValue()},`
  }

  // Generates the getter function for the property
  getGetter(prop) {
    let result = `get${prop.getMixedName(this._modelObject)} () { return this._data.get(${this._name}._${prop.getMixedName(this._modelObject)}Key) }`
    if (prop.isId) {
      result += `\n  get${prop.getMixedName(undefined, false)} () { return this._data.get(${this._name}._${prop.getMixedName(this._modelObject)}Key) }`
    }
    if (prop.type === 'string' && prop.format === 'date')
      result += `\n  get${prop.getMixedName()}String () { return this._data.get(${this._name}._${prop.getMixedName()}Key).toLocaleString() }`
    return result
  }

  // Generates the validator function for the property
  getValidator(prop) {
    const getter = `get${prop.getMixedName(this._modelObject)}()`
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
        result= `this.${getter} == null || \n          (` + result + ')'
    }
    return `is${prop.getMixedName(this._modelObject)}Valid () { return ${result} }`
  }

  // Generates payload element code for the property
  getPayloadElement(prop) {
    let transform = ""
    if (prop.type === 'object') transform = ".toJS()"
    else if (prop.type === 'string' && prop.format === 'date') transform = ".toJSON()"
    let convertPrefix = ""
    let convertSuffix = ""
    if (prop.type === 'integer') {
      convertPrefix = 'parseInt('
      convertSuffix = ')'
    } else if (prop.type === 'number') {
      convertPrefix = 'parseFloat('
      convertSuffix = ')'
    }
    if (!prop.nullable) {
      return `[${this._name}._${prop.getMixedName(this._modelObject)}Key]: ${convertPrefix}this.get${prop.getMixedName(this._modelObject)}()${transform}${convertSuffix},`
    } else {
      return `[${this._name}._${prop.getMixedName(this._modelObject)}Key]: this.get${prop.getMixedName(this._modelObject)}() ? ${convertPrefix}this.get${prop.getMixedName(this._modelObject)}()${transform}${convertSuffix} : null,`
    }
  }

  // Generates property validation call for new object validity test
  getValids(prop) {
    return `if (!this.is${prop.getMixedName(this._modelObject)}Valid()) { result = false }`
  }

  // Generates input transformation code for reading response payloads
  getInputTransform(prop) {
    return `this._data = this._data.set(${this._name}._${prop.getMixedName()}Key, new Date(createFrom[${this._name}._${prop.getMixedName()}Key]))`
  }

  // Generates code to remove create-only fields from payload
  getCreateOnly(prop) {
    return `delete payload.${prop.name}`
  }

  // Generates code to create a regular express test for any strings with pattern specified
  getPatternDef(prop) {
    // Note that leading and trailing / should not be required, see Connexion issue #871
    return `const ${prop.name}Test = /${prop.pattern}/`
  }

  getInitialContext() {
    const result = super.getInitialContext()
    result['desc'] = this._modelObject._description
    result['apiPrefix'] = this._modelObject._identitySchema.apiPrefix ? this._modelObject._identitySchema.apiPrefix : ''
    result['baseClass'] = this._modelObject._rimType === 'simple' ? 'SimpleObjectService' : 'RelationshipObjectService'
    this._sections.forEach((key) => {
      result[key] = []
    })
    return result
  }

  processProperty(context, prop) {
    context['varnames'].push(this.getFieldConstant(prop))
    if (!prop.writeOnly) {
      context['defvals'].push(this.getDefaultValue(prop))
    }
    context['getters'].push(this.getGetter(prop))
    if (prop.needsInputTransform()) context['transforms'].push(this.getInputTransform(prop))
    if (prop.needsValidation()) {
        context['validators'].push(this.getValidator(prop))
        context['valids'].push(this.getValids(prop))
    }
    if (!prop.readOnly && !prop.linkedObject) context['payloads'].push(this.getPayloadElement(prop))
    if (prop.createOnly) context['createOnlys'].push(this.getCreateOnly(prop))
    if (prop.pattern) context['patterns'].push(this.getPatternDef(prop))
    return context
  }

  finalizeContext(context) {
    // Default values last element needs to not have trailing commna, and have object and function close
    context['defvals'][context['defvals'].length-1] = context['defvals'][context['defvals'].length-1].slice(0, -1) + "})"
    // Payloads value list needs to not have a trailing comma
    context['payloads'][context['payloads'].length-1] = context['payloads'][context['payloads'].length-1].slice(0, -1)
    return context
  }
}