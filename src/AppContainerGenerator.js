/* AppContainerGenerator.js - Generates AppContainer.js in the source root directory */
import BaseSingleGenerator from './BaseSingleGenerator'

export default class AppContainerGenerator extends BaseSingleGenerator {
  constructor(config, modelObjects) {
    super (modelObjects,
      config['paths']['templates'] + '/' + config['templates']['AppContainer'],
      config['paths']['sourceRoot'] + '/AppContainer.jsx',
      false)
    this._sections = []
  }
}
