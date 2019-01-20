/* Property.js - Class representing a schema property */
import { toCamelCase, toSnakeCase, toMixedCase } from './util'

export default class Property {
  constructor(schemaName, name, attributes) {
    this.schemaName = schemaName
    this.name = name
    this._attributes = attributes
    this.type = attributes.type
    this.baseObject = 'x-wsag-base-object' in attributes ? attributes['x-wsag-base-object'] : false
    this.createOnly = 'x-wsag-create-only' in attributes ? attributes['x-wsag-create-only'] : false
    this.isId = 'x-wsag-model-id' in attributes ? attributes['x-wsag-model-id'] : false
    this.description = attributes['description']
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
  }

  // ID code generation is special cased
//  getCamelName () { return this.isId ? "id" : toCamelCase(this.name) }
  getMixedName () { return this.isId ? "Identity": toMixedCase(this.name) }
//  getUpperName () { return this.isId ? "ID" : toSnakeCase(this.name).toUpperCase() }

  // Provides initialization value for fields in new object
  defaultValue () {
    switch (this.type) {
      case 'string': return this.format === 'date' ? "new Date(0)" : "''"
      case 'object': return 'Map({})'
      case 'number': return '0'
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