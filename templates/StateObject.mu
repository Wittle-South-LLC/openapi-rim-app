/* {{ name }}.js - State class for {{ name }} model objects */
import { defineMessages } from 'react-intl'
import Orim{{ name }} from './orim/Orim{{ name }}'
{{#if isUser }}import { defaultVerbs } from 'redux-immutable-model'{{/if}}

export default class {{ name }} extends Orim{{name}} {

  // We need this because uglify / minify will munge the actual class name
  static className = '{{ name }}'

  constructor(createFrom, dirtyVal = false, fetchingVal = false, newVal = false) {
    super (createFrom, dirtyVal, fetchingVal, newVal)
  }

  {{#if isUser }}
  getFetchPayload (verb) {
    switch (verb) {
      case defaultVerbs.LOGIN:
        return { username: this.getUsername(), password: this.getPassword() }
      case defaultVerbs.LOGOUT:
        return {}
      default:
        return super.getFetchPayload(verb)
    }
  }
  {{/if}}

  static msgs = defineMessages({
    {{#each intlMessage }}
    {{{ this }}}
    {{/each}}  
  })
}
