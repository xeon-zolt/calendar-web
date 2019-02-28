import { combineReducers } from 'redux'

// Reducers
import auth from './auth/reducer'
import events from './event/reducer'
import gaia from './gaia/reducer'
// import lazy from './lazy/reducer'

export default combineReducers({
  // lazy,
  auth,
  events,
  gaia,
})
