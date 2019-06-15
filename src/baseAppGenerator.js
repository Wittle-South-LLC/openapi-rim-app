/* baseAppGenerator.js - Generates baseApp.js in objects directory */
import BaseSingleGenerator from './BaseSingleGenerator'

export default class baseAppGenerator extends BaseSingleGenerator {
  constructor(config, modelObjects) {
    super (modelObjects,
      config['paths']['templates'] + '/' + config['templates']['baseApp'],
      config['paths']['stateObjects'] + '/baseApp.js',
      false)
    this._sections = []
  }
}
