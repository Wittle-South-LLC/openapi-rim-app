/* Schema.js - Class representing an OpenAPI 3.0 schema object */

import Property from "./Property";

export default class Schema {
  constructor(name, attributes) {
    this.name = name
    this._attributes = attributes
    this.description = attributes['description']
    this.identityObject = attributes['x-wsag-create']
    this.updateObject = attributes['x-wsag-update']
    this.emitTests = attributes['x-wsag-testme']
    this._properties = {}
    this._references = []
    var propertiesYaml = undefined
    if (attributes['properties']) {
      propertiesYaml = attributes['properties']
    } else if (attributes['allOf']) {
      var allOf = attributes['allOf']
      for (var item in allOf) {
        if (!allOf.hasOwnProperty(item)) continue
        if (item['type'] === 'object') {
          propertiesYaml = item['properties']
        } else if (item['$ref']) {
          this._references.push(item['$ref'])
        }
      }
    }
    if (propertiesYaml) {
      for (var property in propertiesYaml) {
        if (!attributes.properties.hasOwnProperty(property)) continue
        this._properties[property] = new Property(name, property, attributes.properties[property])
      }
    }
  }

  // Return the dictionary of properties for this schema
  getProperties () {
    return this._properties
  }

  // Return a Property object for the given name, if it exists in the schema
  getProperty (name) {
    return this._properties[name]
  }
}