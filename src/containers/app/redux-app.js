import React from "react";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { connect } from "react-redux";
import thunk from "redux-thunk";
import App from "./App";

import ConnectedEventCalendar from "./redux-event-calendar";
import ConnectedEventDetails from "./redux-event-details";
import ConnectedUserProfile from "./redux-user-profile";
import ConnectedGuestList from "./redux-guest-list";

import registerServiceWorker from "./registerServiceWorker";

import * as reducers from "../../store/rootReducer";
const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

// #############################################################################################
// :NOTE: Declaring all views instead of blindly passing store to all subcomponents, even the dumb ones.
// This will make it possible to write alternative versions of the app with different stores for each component
store.views = {
  EventCalendar: props => {
    return <ConnectedEventCalendar store={store} {...props} />;
  },
  EventDetails: props => {
    return <ConnectedEventDetails store={store} {...props} />;
  },
  UserProfile: props => {
    return <ConnectedUserProfile store={store} {...props} />;
  },
  GuestList: props => {
    return <ConnectedGuestList store={store} {...props} />;
  }
};

const ConnectedApp = connect((state, redux) => {
  const { EventCalendar, UserProfile } = redux.store.views;
  return {
    views: {
      UserProfile,
      EventCalendar
    }
  };
})(App);

registerServiceWorker();

export default <ConnectedApp store={store} />;
