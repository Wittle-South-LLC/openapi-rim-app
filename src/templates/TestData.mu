import { Map } from 'immutable'
import { CURRENT_ID, OBJECT_MAP } from '../src/state/reduxObject/BaseService'
import { User, USER } from '../src/state/user'
import { VERB_HYDRATE, VERB_LOGIN, FETCH_SUCCESS } from '../src/state/reduxObject/fetchStatusActions'
import baseApp from '../src/state/baseApp'

export const loginState = Map({
  [User.STATE_PATH]: Map({
    [OBJECT_MAP]: Map({
      [User.NEW_ID]: new User({
        [User.ID]: User.NEW_ID,
        [User.USER_NAME]: 'testing',
        [User.PASSWORD]: 'testme0!'
      })
    }),
    [CURRENT_ID]: User.NEW_ID
  })
})

export const defaultLoginData = {
  {{#each testData }}
  {{{ this }}}
  {{/each}}
}

export const defaultState = baseApp(undefined, {
  type: USER,
  verb: VERB_LOGIN,
  status: FETCH_SUCCESS,
  receivedData: defaultLoginData
})

export const resetState = () => baseApp(undefined, {
  type: USER,
  verb: VERB_HYDRATE,
  status: FETCH_SUCCESS,
  receivedData: defaultLoginData
})
