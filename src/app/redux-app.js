import React, { Component } from "react";
import { connect } from "react-redux";
import App from "./App";

import ConnectedEventCalendar from "./redux-event-calendar";
import ConnectedEventDetails from "./redux-event-details";
import ConnectedUserProfile from "./redux-user-profile";
import ConnectedGuestList from "./redux-guest-list";

import registerServiceWorker from "./registerServiceWorker";
import { createInitialStore, storeAfterAppMount } from "../store/storeManager";
let store = createInitialStore();

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

class DynamicApp extends Component {
  render() {
    return <ConnectedApp store={store} />;
  }
  componentDidMount() {
    storeAfterAppMount(store, () => {
      this.forceUpdate();
    });
  }
}

registerServiceWorker();

export default <DynamicApp />;
