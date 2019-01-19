/* BaseGenerator.js - Base object for source generation */

/* This class implements shared behavior for code generators. Specifically,
   initializing a Moustach context, updating that context for each property
   of a model object, and writing the resulting generated source file that
   is a product of the Handlebars template and the context created from the
   model object by the specific generator subclass */

import Handlebars from 'handlebars'    // Template language for code generation
var fs = require('fs')                 // Read/write files

export default class BaseGenerator {
  constructor(modelObject, templateFileName, outputFileName) {
    this._modelObject = modelObject            // A redux-immutable-object class
    this._name = modelObject._name
    this._templateFileName = templateFileName  // File name containing the template
    this._outputFileName = outputFileName      // File name for the generator output
  }

  // This is a base method intended to be overridden in subclasses; it should return
  // an initialized context for the specific source file being generated
  getInitialContext() {
    return { name: this._modelObject.name }
  }
 
  // This is a base method intended to be overridden in subclasses; it should update
  // the given context as needed based on the provided property
  processProperty(context, prop) {
    return context
  }

  // Implements the default behavior of iterating through the properties of the
  // model object and updating the Handlebars context as needed
  populateContext(context) {
    const propertyList = this._modelObject.getAllProperties()
    for (var propName in propertyList) {
      const prop = propertyList[propName]
      this.processProperty(context, prop)
    }
  }

  // This is a base method intended to be overridden in subclasses; it should
  // do any post-processing on the context needed after all properpty updates
  // are complete
  finalizeContext(context) {
    return context
  }
 
  // Implements the default behavior of reading the template file, creating the
  // context, and rendering the resulting source file
  render() {
    const template = Handlebars.compile(fs.readFileSync(this._templateFileName, 'utf8'))
    const myContext = this.getInitialContext()
    this.populateContext(myContext)
    this.finalizeContext(myContext)
    const result = template(myContext)
    fs.writeFileSync(this._outputFileName, result)
  }
}