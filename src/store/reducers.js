import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

// Reducers
import auth from './auth/reducer'
import events from './event/reducer'
import gaia from './gaia/reducer'

export default history =>
  combineReducers({
    router: connectRouter(history),
    auth,
    events,
    gaia,
  })
