/* OrimServices.js - Instantiates services for model objects */
import { Configuration, RelationshipObjectService, SimpleObjectService } from 'redux-immutable-model'
import { applyHeaders } from '../utils/jwt'
{{#each imports }}
{{{ this }}}
{{/each}}

export const config = new Configuration()

// Set the login and logout paths for this application
const myGetApiPath = (verb, prefix) => {
  if (verb === config.verbs.LOGIN || verb === config.verbs.HYDRATE) return `/${prefix}/login`
  if (verb === config.verbs.LOGOUT) return `/${prefix}/logout`
  return undefined
}

// Need to add a getApiPath function to the configuration handle login / logout
config.setGetApiPath(myGetApiPath)
config.setApplyHeaders(applyHeaders)

{{#each exports }}
{{{ this }}}
{{/each}}

export function addOrimReducers(stateObj) {
  {{#each addReducers }}
  {{{ this }}}
  {{/each}}
  return stateObj
}