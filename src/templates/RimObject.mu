/* {{ name }}.js - state object for {{ name }} state */
import { Map } from 'immutable'
import { defineMessages } from 'react-intl'
import ReduxObject from './reduxObject/ReduxObject'
import BaseService from './reduxObject/BaseService'
import typeMessages from './messages/{{ name }}Messages'

const TYPE = '{{ name }}'
const TYPE_DESC = '{{ desc }}'

// Define any constants required for pattern validations
{{#each patterns}}
{{{ this }}}
{{/each}}

export const componentText = defineMessages({
  createSuccess: { id: TYPE + '.createdMessage', defaultMessage: TYPE_DESC + ' created successfully' },
  deleteSuccess: { id: TYPE + '.deletedMessage', defaultMessage: TYPE_DESC + ' deleted successfully' },
  updateSuccess: { id: TYPE + '.updatedMessage', defaultMessage: TYPE_DESC + ' updated successfully' }
})

export class {{ name }} extends ReduxObject {
  // Define the static constant for where these objects are in state
  static STATE_PATH = TYPE + 's'
  static API_PATH = '/' + TYPE
  static NEW_ID = 'new'

  // Define constants that correspond to field names in API data
  {{#each varnames }}
  {{{ this }}}
  {{/each}}

  static _service = new BaseService({{ name }}, TYPE, {{ name }}.API_PATH, {{ name }}.STATE_PATH, componentText)
  static msgs = typeMessages

  constructor (paramObj) {
    super(paramObj)

    if (this.data === null && !paramObj) {
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
    // If we don't have a {{ name }} ID, set it to a new one
    if (!this.data.has({{ name }}.ID) || !this.data.get({{ name }}.ID)) {
      this.data = this.data.set({{ name }}.ID, {{ name }}.NEW_ID)
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
