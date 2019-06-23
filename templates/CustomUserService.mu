/* CustomUserService.js - Customized service for User objects */
import { callAPI, SingleObjectService, status } from 'redux-immutable-model'
import User from './User'

const VERB_NEW = 'NEW'
const VERB_CANCEL_NEW = 'CANCEL_NEW'

export default class CustomUserService extends SingleObjectService {
  constructor(config) {
    super(User, config)

    // Method bindings
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }
  reducer(state, action) {
    let newState = super.reducer(state, action)
    // If we've logged in successfully, the new user object we created with username/password
    // is no longer needed, so it should be deleted
    if (action.verb === this.config.verbs.LOGIN && action.status === status.SUCCESS) {
      newState = this.delete(action.rimObj)
    } else if (action.verb === VERB_NEW) {
      newState = this.setById(new User())
    } else if (action.verb === VERB_CANCEL_NEW) {
      newState = this.delete(action.rimObj)
    }
    return this.setState(newState)
  }

  // Add action to perform login
  login (username, password) {
    const myUser = new User({username: username, password: password}, false, false, true)
    this.setById(myUser)
    return callAPI(this, this.config.verbs.LOGIN, 'POST', myUser)
  }

  // Add action to perform logout
  logout (user) {
    return callAPI(this, this.config.verbs.LOGOUT, 'POST', user)
  }
}
