import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import { logger } from 'redux-logger'

import createHistory from 'history/createBrowserHistory'

// Reducers
import reducers from './reducers'

export const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const historyMiddleware = routerMiddleware(history)

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// Middlewares
const middlewares = [thunk, historyMiddleware]

// Redux Logger
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger)
}

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(...middlewares))
)

store.asyncReducers = {}

export default store
