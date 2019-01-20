/* BaseSingleGenerator.js - Base object for source generation across objects */

/* This class implements shared behavior for code generators that generate a
   single source file for all model objects. Specifically, initializing a 
   Handlebars context, updating that context for each model object, and writing
   the resulting generated source file that is a product of the Handlebars 
   template and the context created from the model object by the specific 
   generator subclass */

import Handlebars from 'handlebars'    // Template language for code generation
var fs = require('fs')                 // Read/write files

export default class BaseSingleGenerator {
  constructor(modelObjects, templateFileName, outputFileName, overwrite = true) {
    this._modelObjects = modelObjects          // A redux-immutable-object class
    this._templateFileName = templateFileName  // File name containing the template
    this._outputFileName = outputFileName      // File name for the generator output
    this._overwrite = overwrite                // Flag if existing files should be overwritten
  }

  // This is a base method intended to be overridden in subclasses; it should return
  // an initialized context for the specific source file being generated
  getInitialContext() {
    return {}
  }
 
  // This is a base method intended to be overridden in subclasses; it should update
  // the given context as needed based on the provided model
  processModel(context, model) {
    return context
  }

  // Implements the default behavior of iterating through the models and updating 
  // the Handlebars context as needed
  populateContext(context) {
    for (var modelName in this._modelObjects) {
      const model = this._modelObjects[modelName]
      this.processModel(context, model)
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
      fs.writeFileSync(this._outputFileName, result)
    }
  }
}