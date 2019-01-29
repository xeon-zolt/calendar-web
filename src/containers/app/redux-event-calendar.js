import React, { Component } from "react";
import { connect } from "react-redux";
import EventCalendar from "../event-calendar/EventCalendar";

import * as eventAction from "../../store/eventAction";

export default connect(
  (state, redux) => {
    console.log("[ConnectedEventCalendar]", state, redux.store);
    const { events, auth } = state;
    const { EventDetails } = redux.store.views;
    const signedIn = !!auth.user;
    const { inviteSuccess } = events;
    return {
      events,
      signedIn,
      inviteSuccess,
      views: {
        EventDetails
      }
    };
  },
  dispatch => {
    return {
      GetInitialEvents: search => dispatch(eventAction.GetInitialEvents(search))
    };
  }
)(EventCalendar);
