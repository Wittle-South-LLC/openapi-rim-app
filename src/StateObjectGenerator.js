/* StateObjectGenerator.js - Generates the customization classes */
import BaseModelGenerator from './BaseModelGenerator'

export default class StateObjectGenerator extends BaseModelGenerator {
  constructor(config, modelObject) {
    super (modelObject,
      config['TEMPLATES']['PATH'] + '/' + config['TEMPLATES']['STATE_OBJECT'],
      config['APP']['STATE_OBJECT_PATH'] + '/' + modelObject._name + '.js',
      false)
  }
}