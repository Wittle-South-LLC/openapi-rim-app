/* OrimServices.js - Instantiates services for model objects */
import { BaseRIMService, Configuration } from 'redux-immutable-model'
{{#each imports }}
{{{ this }}}
{{/each}}

const config = new Configuration()

{{#each exports }}
{{{ this }}}
{{/each}}

export function addOrimReducers(stateObj) {
  {{#each addReducers }}
  {{{ this }}}
  {{/each}}
  return stateObj
}