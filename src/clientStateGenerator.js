/* clientStateGenerator.js - Generates clientState.js in objects directory */
import BaseSingleGenerator from './BaseSingleGenerator'

export default class baseAppGenerator extends BaseSingleGenerator {
  constructor(config, modelObjects) {
    super (modelObjects,
      config['paths']['templates'] + '/' + config['templates']['clientState'],
      config['paths']['stateObjects'] + '/clientState.js',
      false)
    this._sections = []
  }
}
