/* {{ name }}.js - State class for {{ name }} model objects */
import { defineMessages } from 'react-intl'
import Orim{{ name }} from './orim/Orim{{ name }}'

export default class {{ name }} extends Orim{{name}} {
  constructor(createFrom, dirtyVal = false, fetchingVal = false, newVal = false) {
    super (createFrom, dirtyVal, fetchingVal, newVal)
  }

  static msgs = defineMessages({
    {{#each intlMessage }}
    {{{ this }}}
    {{/each}}  
  })
}
