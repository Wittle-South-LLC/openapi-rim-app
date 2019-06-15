/* AppGenerator.js - Generates App.js in the source root directory */
import BaseSingleGenerator from './BaseSingleGenerator'

export default class baseAppGenerator extends BaseSingleGenerator {
  constructor(config, modelObjects) {
    super (modelObjects,
      config['paths']['templates'] + '/' + config['templates']['App'],
      config['paths']['sourceRoot'] + '/App.js',
      false)
    this._sections = []
  }
}
