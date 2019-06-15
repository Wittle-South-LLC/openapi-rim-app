/* {{ name }}.js - generated state object for {{ modelName }} model objects */
/* DO NOT EDIT THIS GENERATED FILE - Edit the subclass state file instead! */

import { Map } from 'immutable'
import { defaultVerbs, BaseRIMObject } from 'redux-immutable-model'

// Define any constants required for pattern validations
{{#each patterns}}
{{{ this }}}
{{/each}}

export default class {{ name }} extends BaseRIMObject {

  // Define constants that correspond to field names in API data
  {{#each varnames }}
  {{{ this }}}
  {{/each}}

  static _NewID = 'New{{ modelName }}'
  static _apiPrefix = '{{ apiPrefix }}'

  constructor (createFrom, dirtyVal, fetchingVal, newVal) {
    super(createFrom, dirtyVal, fetchingVal, newVal)

    if (!createFrom) {
      // No param object and no data - create empty initialized object
      this._data = Map({ {{#each defvals }}{{{ this }}}
      {{/each}}
    } else {
      // This is where we do any transformations that are needed (e.g. dates)
      {{#each transforms }}
      {{{ this }}}
      {{/each}}
    }
  }

  // Getters for fields
  {{#each getters }}
  {{{ this }}}
  {{/each}}

  // Validators for fields
  {{#each validators }}
  {{{ this }}}
  {{/each}}

  getFetchPayload (verb) {
    const payload = {
      {{#each payloads }}
        {{{ this }}}
      {{/each}}
    }
    if (verb === defaultVerbs.SAVE_UPDATE) {
      return payload
    } else if (verb === defaultVerbs.SAVE_NEW) {
      {{#each createOnlys }}
      {{{ this }}}
      {{/each}}
      return payload
    }
    return {}
  }

  isValid () {
    let result = true
    {{#each valids }}
    {{{ this }}}
    {{/each}}
    return result
  }
}
