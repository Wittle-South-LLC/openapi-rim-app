/* Property.js - Class representing a schema property */
import { toCamelCase, toSnakeCase, toMixedCase } from './util'

export default class Property {
  constructor(schemaName, name, attributes) {
    this.schemaName = schemaName
    this.name = name
    this._attributes = attributes
    this.type = attributes.type
    this.baseObject = 'x-orim-base-object' in attributes ? attributes['x-orim-base-object'] : false
    this.createOnly = 'x-orim-create-only' in attributes ? attributes['x-orim-create-only'] : false
    this.linkedObject = 'x-orim-linked-object' in attributes ? attributes['x-orim-linked-object'] : undefined
    this.isId = 'x-orim-model-id' in attributes ? attributes['x-orim-model-id'] : false
    this.isId = 'x-smoacks-model-id' in attributes ? attributes['x-smoacks-model-id'] : this.isId
    this.description = attributes['description']
    this.default = 'default' in attributes ? attributes.default : undefined
    this.enum = attributes['enum']
    this.example = attributes['example']
    this.exclusiveMaximum = 'exclusiveMaximum' in attributes ? attributes.exclusiveMaximum : false
    this.exclusiveMinimum = 'exclusiveMinimum' in attributes ? attributes.exclusiveMinimum : false
    this.format = attributes['format']
    this.maximum = attributes['maxiumum']
    this.maxLength = attributes['maxLength']
    this.minimum = attributes['minimum']
    this.minLength = attributes['minLength']
    this.nullable = attributes['nullable']
    this.pattern = attributes['pattern']
    this.readOnly = 'readOnly' in attributes ? attributes.readOnly : false
    this.writeOnly = 'writeOnly' in attributes ? attributes.writeOnly : false
  }

  // ID code generation is special cased
//  getCamelName () { return this.isId ? "id" : toCamelCase(this.name) }
  getMixedName ( model, translateIdentity = true ) {
    if (!this.isId || !translateIdentity) { return toMixedCase(this.name) }
    if (!model || model._rimType === 'simple') { return "Identity" }
    return model.getIdentityName( this )
  }
  getIntlName () {
    var baseName = toMixedCase(this.name)
    return baseName.charAt(0).toLowerCase() + baseName.slice(1)
  }
//  getUpperName () { return this.isId ? "ID" : toSnakeCase(this.name).toUpperCase() }

  // Provides initialization value for fields in new object
  defaultValue () {
    if (this.default !== undefined) return this.default
    switch (this.type) {
      case 'string': return this.format === 'date' ? "new Date(0)" : "''"
      case 'object': return 'Map({})'
      case 'number': return '0'
      case 'array': return '[]'
      default: return 'undefined'
    }
  }

  // Get example in code form
  exampleValue () {
    if (!this.example) return 'null'
    switch (this.type) {
      case 'string': return "'" + this.example + "'"
      case 'object': return JSON.stringify(this.example)
      default: return this.example
    }
  }

  // Get invalid value for validation tests
  getInvalidValue () {
    if (this.isId) return "''"
    if (this.type !== 'string' || !this.nullable) return 'undefined'
    if (this.minLength) return "'X'"
    if (this.maxLength) return "'" + 'X'.repeat(this.maxLength + 1) + "'"
    return 10
  }

  // Returns true if this property needs validation
  needsValidation () {
    return !this.readOnly && (!this.nullable || this.maxLength || this.minLength || 
           this.minimum || this.maximum || this.enum || this.pattern)
  }

  // Returns true if this property needs type transformation when reading server response
  needsInputTransform () {
    return this.type === 'string' && this.format === 'date'
  }
}