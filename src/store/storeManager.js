import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";

import events from "./event/eventReducer";
import auth from "./auth/authReducer";
import view from "./view/viewReducer";

function createReducer(asyncReducers) {
  return combineReducers({
    view,
    auth,
    ...asyncReducers
  });
}

export function createInitialStore(initialState) {
  let store = createStore(createReducer({ events }), applyMiddleware(thunk));
  store.asyncReducers = {};
  return store;
}

export function storeAfterAppMount(store, whenDone) {
  /*
  import("./event/eventReducer").then(({ default: events }) => {
    store.replaceReducer(createReducer({ events }));
    store.dispatch({ type: EVENTS_ENABLED });
    import("./event/eventAction").then(({ initializeEvents }) => {
      initializeEvents();
    });
  });
  */
}
