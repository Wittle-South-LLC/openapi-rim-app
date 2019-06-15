/* jwtGenerator.js - Generates jwt.js in utils directory */
import BaseSingleGenerator from './BaseSingleGenerator'

export default class jwtGenerator extends BaseSingleGenerator {
  constructor(config, modelObjects) {
    super (modelObjects,
      config['paths']['templates'] + '/' + config['templates']['jwt'],
      config['paths']['sourceUtil'] + '/jwt.js',
      false)
    this._sections = []
  }
}
