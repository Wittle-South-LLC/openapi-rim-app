/* Schema.js - Class representing an OpenAPI 3.0 schema object */
import Property from "./Property";

// Singleton pattern for named collection of defined schemas
export const schemaService = {}

export class Schema {
  constructor(name, attributes) {
    this.name = name
    this._attributes = attributes
    this.description = attributes['description']
    this.identityObject = attributes['x-orim-create'] ? attributes['x-orim-create'] : attributes['x-smoacks-create']
    this.apiPrefix = attributes['x-orim-api-prefix'] ? attributes['x-orim-api-prefix'] : undefined
    this.smoacksObject = attributes['x-smoacks-object']
    this.smoacksApiVerbParam = attributes['x-smoacks-api-verb-param']
    this.smoacksApiVerbResp = attributes['x-smoacks-api-verb-resp']
    this.updateObject = attributes['x-orim-update']
    this.emitTests = attributes['x-orim-testme']
    this._properties = {}
    this._references = []
    var propertiesYaml = undefined
    if (attributes['properties']) {
      propertiesYaml = attributes['properties']
    } else if (attributes['allOf']) {
      var allOf = attributes['allOf']
      for (var i = 0; i < allOf.length; i++) {
        let item = allOf[i]
        if (item['type'] === 'object') {
          propertiesYaml = item['properties']
        } else if (item['$ref']) {
          this._references.push(item['$ref'])
        }
      }
    }
    /* istanbul ignore else */
    if (propertiesYaml) {
      for (var property in propertiesYaml) {
        this._properties[property] = new Property(name, property, propertiesYaml[property])
      }
    }
    // Store this schema in the schema service
    schemaService[this.name] = this
  }

  // Return the dictionary of properties for this schema
  getProperties () {
    return this._properties
  }
}