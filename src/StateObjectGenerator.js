/* StateObjectGenerator.js - Generates the customization classes */
import BaseModelGenerator from './BaseModelGenerator'

export default class StateObjectGenerator extends BaseModelGenerator {
  constructor(config, modelObject) {
    super (modelObject,
      config['paths']['templates'] + '/' + config['templates']['stateObjects'],
      config['paths']['stateObjects'] + '/' + modelObject._name + '.js',
      false)
  }
}