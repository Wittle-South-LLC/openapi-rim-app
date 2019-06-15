/* CustomUserServiceGenerator.js - Generates custom service that supports login */
import BaseSingleGenerator from './BaseSingleGenerator'

export default class CustomUserServiceGenerator extends BaseSingleGenerator {
  constructor(config, modelObjects) {
    super (modelObjects,
      config['paths']['templates'] + '/' + config['templates']['CustomUserService'],
      config['paths']['stateObjects'] + '/CustomUserService.js',
      false)
    this._sections = []
  }
}
