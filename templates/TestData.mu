import { Map } from 'immutable'
import { defaultVerbs, status } from 'redux-immutable-model'
import baseApp from '../src/state/baseApp'

export const defaultLoginData = {
  {{#each testData }}
  {{{ this }}}
  {{/each}}
}

export const defaultState = baseApp(undefined, {
  type: 'async',
  verb: defaultVerbs.LOGIN,
  status: status.SUCCESS,
  receivedData: defaultLoginData,
  rimObj: new User()
})

export const resetState = () => baseApp(undefined, {
  type: 'async',
  verb: defaultVerbs.HYDRATE,
  status: status.SUCCESS,
  receivedData: defaultLoginData
})
