import React from "react";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import App from "./App";

import EventCalendar from "./redux-event-calendar";
import UserProfile from "./redux-user-profile";

import registerServiceWorker from "./registerServiceWorker";

import * as reducers from "../../store/rootReducer";
const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

const ReduxApp = () => {
  return (
    <App
      store={store}
      EventCalendar={props => {
        return <EventCalendar store={store} {...props} />;
      }}
      UserProfile={props => {
        return <UserProfile store={store} {...props} />;
      }}
    />
  );
};
registerServiceWorker();

export default <ReduxApp />;
