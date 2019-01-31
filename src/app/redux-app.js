import React, { Component } from "react";
import { connect } from "react-redux";
import App from "./App";

import ConnectedEventCalendar from "./redux-event-calendar";

import registerServiceWorker from "./registerServiceWorker";
import { createInitialStore } from "../store/storeManager";
import { SET_VIEW } from "../store/ActionTypes";

let store = createInitialStore();

// #############################################################################################
// :NOTE: Declaring all views instead of blindly passing store to all subcomponents, even the dumb ones.
// This will make it possible to write alternative versions of the app with different stores for each component

const PlaceHolder = props => {
  return <div />;
};

let views = {
  EventCalendar: props => {
    return <ConnectedEventCalendar store={store} {...props} />;
  },
  UserProfile: PlaceHolder,
  EventDetails: PlaceHolder,
  GuestList: PlaceHolder
};
store.dispatch({ type: SET_VIEW, payload: views });

const ConnectedApp = connect((state, redux) => {
  const { EventCalendar, UserProfile } = state.lazy || {
    EventCalendar: PlaceHolder,
    UserProfile: PlaceHolder
  };
  return {
    views: {
      UserProfile,
      EventCalendar
    }
  };
})(App);

class DynamicApp extends Component {
  render() {
    return <ConnectedApp store={store} />;
  }
  componentDidMount() {
    import("../store/lazy/lazyAction").then(({ initializeLazy }) => {
      store.dispatch(initializeLazy(store));
      // this.forceUpdate();
    });
  }
}

registerServiceWorker();

export default <DynamicApp />;
