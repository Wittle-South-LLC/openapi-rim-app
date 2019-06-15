/* StateObjectGenerator.js - Generates the customization classes */
import BaseModelGenerator from './BaseModelGenerator'

export default class StateObjectGenerator extends BaseModelGenerator {
  constructor(config, modelObject) {
    super (modelObject,
      config['paths']['templates'] + '/' + config['templates']['stateObjects'],
      config['paths']['stateObjects'] + '/' + modelObject._name + '.js',
      false)
    this._sections = ['intlMessage']
  }

  getFieldIntlMessages(prop) {
    return [
      `${prop.getIntlName()}Label: { id: '${prop.schemaName}.${prop.getIntlName()}', defaultMessage: '${prop.getMixedName()}' },`,
      `${prop.getIntlName()}Placeholder: { id: '${prop.schemaName}.${prop.getIntlName()}', defaultMessage: '${prop.getMixedName()}...' },`,
      `${prop.getIntlName()}Invalid: { id: '${prop.schemaName}.${prop.getIntlName()}', defaultMessage: '${prop.getMixedName()} is invalid' },`
    ]    
  }

  // Initializes context with an empty array for each section
  getInitialContext() {
    const result = super.getInitialContext()
    this._sections.forEach((key) => {
      result[key] = []
    })
    return result
  }

  processProperty(context, prop) {
    if (!prop.isId) {
      context['intlMessage'] = context['intlMessage'].concat(this.getFieldIntlMessages(prop))
    }
  }
}