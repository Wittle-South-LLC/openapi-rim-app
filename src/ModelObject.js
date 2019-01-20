/* ModelObject.js - Represents a data model object */

/* There may be multiple API schemas that map to a single
   model object; the goal of this class is to capture the
   set of schemas for a model object, and be able to present
   all of the properties of a model object for code generation */

import { toCamelCase, toMixedCase, toSnakeCase } from './util'

export default class ModelObject {
  constructor(name, description) {
    this._name = name
    this._description = description
    this._identitySchema = undefined
    this._updateSchema = undefined
  }
  getAllProperties() {
    let result = {}
    if (this._updateSchema) result = { ...result, ...this._updateSchema.getProperties() }
    if (this._identitySchema) result = { ...result, ...this._identitySchema.getProperties() }
    return result
  }
  getIdProperty() {
    let result = undefined
    const myProperties = this.getAllProperties()
    for (var propName in myProperties) {
      if (myProperties[propName].isId) {
        result = myProperties[propName]
      }
    }
    return result
  }
//  getCamelName() { return toCamelCase(this._name) }
  getMixedName() { return toMixedCase(this._name) }
//  getSnakeName() { return toSnakeCase(this.name) }
  setIdentitySchema(schema) { this._identitySchema = schema }
  setUpdateSchema(schema) { this._updateSchema = schema }
}