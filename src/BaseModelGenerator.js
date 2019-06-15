/* BaseModelGenerator.js - Base object for source generation from model object */

/* This class implements shared behavior for code generators based on a single
   model object. Specifically, initializing a Handlebars context, updating that
   context for each property of a model object, and writing the resulting 
   generated source file that is a product of the Handlebars template and the
   context created from the model object by the specific generator subclass */

import Handlebars from 'handlebars'    // Template language for code generation
import { ensureDirectoryExists } from './util'  // Creates directories if needed
var fs = require('fs')                 // Read/write files

export default class BaseModelGenerator {
  constructor(modelObject, templateFileName, outputFileName, overwrite = true) {
    this._modelObject = modelObject            // A redux-immutable-object class
    this._name = modelObject._name
    this._templateFileName = templateFileName  // File name containing the template
    this._outputFileName = outputFileName      // File name for the generator output
    this._overwrite = overwrite                // Flag if existing files should be overwritten
  }

  // This is a base method intended to be overridden in subclasses; it should return
  // an initialized context for the specific source file being generated
  getInitialContext() {
    return { name: this._name, modelName: this._modelObject._name }
  }
 
  // This is a base method intended to be overridden in subclasses; it should update
  // the given context as needed based on the provided property
  /* istanbul ignore next - This is essentially an abstract method */
  processProperty(context, prop) {
    return context
  }

  // Implements the default behavior of iterating through the properties of the
  // model object and updating the Handlebars context as needed
  populateContext(context) {
    const propertyList = this._modelObject.getAllProperties()
    // We want to process the ID property first
    const idProperty = this._modelObject.getIdProperty()
    if (idProperty)
      this.processProperty(context, idProperty)
    for (var propName in propertyList) {
      // If this is the ID property, skip because we already processed it
      if (propertyList[propName].isId) continue
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
    // Only render if overwrites are OK or target file does not exist
    if (this._overwrite || !fs.existsSync(this._outputFileName)) {
      const template = Handlebars.compile(fs.readFileSync(this._templateFileName, 'utf8'))
      const myContext = this.getInitialContext()
      this.populateContext(myContext)
      this.finalizeContext(myContext)
      const result = template(myContext)
      ensureDirectoryExists(this._outputFileName)
      fs.writeFileSync(this._outputFileName, result)
    }
  }
}