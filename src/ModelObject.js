/* ModelObject.js - Represents a data model object */

/* There may be multiple API schemas that map to a single
   model object; the goal of this class is to capture the
   set of schemas for a model object, and be able to present
   all of the properties of a model object for code generation */

import { toCamelCase, toMixedCase, toSnakeCase } from './util'
import { schemaService } from './Schema'

export const modelObjectService = {}

export class ModelObject {
  constructor(name, description) {
    this._name = name
    this._description = description
    this._identitySchema = undefined
    this._updateSchema = undefined
    this._properties = {}
    modelObjectService[this._name] = this
    this._idProperties = []
    this._rimType = 'simple'
  }

  finalize () {
    if (this._identitySchema) { this._processSchema(this._identitySchema) }
    if (this._updateSchema) { this._processSchema(this._updateSchema) }
  }

  _processSchema (schema) {
    this._properties = { ...this._properties, ...schema.getProperties() }    
    for (var i = 0; i < schema._references.length; i++ ) {
      const referenceSchemaName = schema._references[i].slice(21)
      this._properties = { ...this._properties, ...schemaService[referenceSchemaName].getProperties() }
    }
    var idList = []
    for (var propName in this._properties) {
      if (this._properties[propName].isId) {
        console.log(`Setting property ${propName} as ID for ${this._name} readOnly is ${this._properties[propName].readOnly}`)
        idList.push(this._properties[propName])
      }
    }
    this._idProperties = idList
    if (this._idProperties.length > 1) {
      this._rimType = 'relationship'
    }
  }

  getIdentityName(prop) {
    if (this._idProperties[0] === prop) {
      console.log(`Returning LeftIdentity for ${prop.name}`)
      return "LeftIdentity"
    } else if (this._idProperties[1] === prop) {
      console.log(`Returning RightIdentity for ${prop.name}`)
      return "RightIdentity"
    } else {
      return "--InvalidModel--"
    }
  }

  getAllProperties() {
    return this._properties
  }

  getIdProperty() {
    return this._idProperties[0]
  }

//  getCamelName() { return toCamelCase(this._name) }
  getMixedName() { return toMixedCase(this._name) }
//  getSnakeName() { return toSnakeCase(this.name) }

  setIdentitySchema(schema) {
    this._identitySchema = schema
  }

  setUpdateSchema(schema) {
    this._updateSchema = schema
  }
}