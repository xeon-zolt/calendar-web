import React, { Component } from "react";
import { connect } from "react-redux";
import EventCalendar from "../event-calendar/EventCalendar";

import * as eventAction from "../../store/eventAction";
import ConnectedEventDetails from "./redux-event-details";

export default connect(
  (state, redux) => {
    console.log("[ConnectedEventCalendar]", state, redux.store);
    var { events, auth } = state;
    const signedIn = !!auth.user;
    const { inviteSuccess } = events;
    return {
      events,
      signedIn,
      inviteSuccess,
      EventDetails: props => {
        return <ConnectedEventDetails store={redux.store} {...props} />;
      },
      store: redux.store
    };
  },
  dispatch => {
    return {
      GetInitialEvents: search => dispatch(eventAction.GetInitialEvents(search))
    };
  }
)(EventCalendar);
