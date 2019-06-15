/* HomeGenerator.js - Generates Home.js in source directory */
import BaseSingleGenerator from './BaseSingleGenerator'

export default class baseAppGenerator extends BaseSingleGenerator {
  constructor(config, modelObjects) {
    super (modelObjects,
      config['paths']['templates'] + '/' + config['templates']['Home'],
      config['paths']['sourceRoot'] + '/Home.js',
      false)
    this._sections = []
  }
}
