/* {{ name }}.js - state object for {{ name }} state */
import { Map } from 'immutable'
import BaseRIMObject from 'redux-immutable-model'
import defaultVerbs from 'redux-immutable-model'

// Define any constants required for pattern validations
{{#each patterns}}
{{{ this }}}
{{/each}}

export class {{ name }} extends BaseRIMObject {

  // Define constants that correspond to field names in API data
  {{#each varnames }}
  {{{ this }}}
  {{/each}}

  static _ApiBasePath = '/{{ name }}s'

  constructor (createFrom, dirtyVal = false, fetchingVal = false, newVal = false) {
    super(createFrom, dirtyVal, fetchingVal, newVal)

    if (this._data === null && !paramObj) {
      // No param object and no data - create empty initialized object
      {{#each defvals }}
      {{{ this }}}
      {{/each}}
    } else if (paramObj) {
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

  getCreatePayload () {
    const payload = {
    {{#each payloads }}
      {{{ this }}}
    {{/each}}
    }
    return payload
  }

  getUpdatePayload () {
    const payload = this.getCreatePayload()
    {{#each createOnlys }}
    {{{ this }}}
    {{/each}}
    return payload
  }

  validateNew () {
    {{#each newvalids }}
    {{{ this }}}
    {{/each}}
  }

  validateUpdate () {
    return this.validateNew()
  }
}
