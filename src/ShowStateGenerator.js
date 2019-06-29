/* ShowStateGenerator.js - Generates page to view state in web UI */
import BaseSingleGenerator from './BaseSingleGenerator'

export default class ShowStateGenerator extends BaseSingleGenerator {
  constructor(config, modelObjects) {
    super (modelObjects,
      config['paths']['templates'] + '/' + config['templates']['ShowState'],
      config['paths']['sourceUtil'] + '/ShowState.jsx',
      false)
    this._sections = ['stateObjects']
  }
  getStateObject(model) {
    return `stateElements.push({key: '${model.getMixedName()}s', label: '${model.getMixedName()}s'})`
  }

  // Initializes context with an empty array for each section
  getInitialContext() {
    const result = super.getInitialContext()
    this._sections.forEach((key) => {
      result[key] = []
    })
    return result
  }

  // Adds to each section as needed for the given model
  processModel(context, model) {
    context['stateObjects'].push(this.getStateObject(model))
    return context
  }
}
