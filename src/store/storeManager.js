import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";

import { events, auth } from "./rootReducer";

function createReducer(asyncReducers) {
  return combineReducers({
    auth,
    ...asyncReducers
  });
}

export function createInitialStore(initialState) {
  let store = createStore(
    combineReducers({ auth, events }),
    applyMiddleware(thunk)
  );
  store.asyncReducers = {};
  return store;
}

export function storeAfterAppMount(store, whenDone) {
  // store.replaceReducer(combineReducers({ auth }));
  whenDone();
}
