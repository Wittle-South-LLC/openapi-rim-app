/* TranslationRunnerGenerator.js - Generates TranslationRunner.js in the util directory */
import BaseSingleGenerator from './BaseSingleGenerator'

export default class TranslationRunnerGenerator extends BaseSingleGenerator {
  constructor(config, modelObjects) {
    super (modelObjects,
      config['paths']['templates'] + '/' + config['templates']['TranslationRunner'],
      config['paths']['util'] + '/translationRunner.js',
      false)
    this._sections = []
  }
}
