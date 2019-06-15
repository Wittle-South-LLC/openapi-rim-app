/* OrimServiceGenerator.js - Generates service declarations for orim objects */
import BaseSingleGenerator from './BaseSingleGenerator'

export default class OrimServiceGenerator extends BaseSingleGenerator {
  constructor(config, modelObjects) {
    super (modelObjects,
      config['paths']['templates'] + '/' + config['templates']['services'],
      config['paths']['stateObjects'] + '/OrimServices.js',
      false)
    this._sections = ['imports', 'exports', 'addReducers']
  }
  getImport(model) {
    console.log(`----> model._name = ${model._name}`)
    if (model._name != 'User') {
      return `import ${model.getMixedName()} from './${model.getMixedName()}'`
    } else {
      return `import CustomUserService from './CustomUserService'`
    }
  }

  getExport(model) {
    console.log(`---2> model._name = ${model._name}`)
    if (model._name != 'User') {
      return `export const ${model.getMixedName()}Service = new BaseRIMService(${model.getMixedName()}, config)`
    } else {
      return `export const UserService = new CustomUserService(config)`
    }
  }

  getAddReducer(model) {
    return `stateObj[${model.getMixedName()}Service.getStatePath()] = ${model.getMixedName()}Service.reducer`
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
    context['imports'].push(this.getImport(model))
    context['exports'].push(this.getExport(model))
    context['addReducers'].push(this.getAddReducer(model))
    return context
  }
}
