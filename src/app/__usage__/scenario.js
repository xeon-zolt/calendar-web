import React, { Component } from "react";

import App from "../App";
// import ReudxApp from "../redux-app";
// import ConnectedEventCalendar from "../redux-event-calendar";
// import ConnectedEventDetails from "../redux-event-details";
// import ConnectedUserProfile from "../redux-user-profile";
// import ConnectedGuestList from "../redux-guest-list";

// import EventDetails from "../../components/event-details/EventDetails";
// import { LoadGuestList, SendInvites } from "../../store/event/eventAction";
// import { REMOVE_EVENT, ADD_EVENT, UPDATE_EVENT } from "../../store/ActionTypes";

// import moment from "moment";
// import * as blockstack from "blockstack";
// import * as ics from "ics";
import * as ICAL from "ical.js";

const dynamicProfile = false;
const dynamicCalendar = true;
const doNothing = () => {};

const EventCalendar = props => {
  if (dynamicCalendar) {
    return <div>EventCalendar</div>;
  } else {
    /*
    let EventCalendarBase = require("../../components/event-calendar/EventCalendar")
      .default;
    return (
      <EventCalendarBase
        GetInitialEvents={() => {}}
        views={{ EventDetails: doNothing }}
        events={{ allEvents: [] }}
      />
    );
    /*
     */
  }
};

const UserProfile = props => {
  if (dynamicProfile) {
    return <div>UserProfile</div>;
  } else {
    let UserProfileBase = require("../../components/auth-user-profile/UserProfile")
      .default;
    return (
      <UserProfileBase
        isSignedIn={true}
        isConnecting={true}
        userSignOut={doNothing}
        userSignIn={doNothing}
      />
    );
  }
};

const Scenario = () => {
  return (
    <div>
      <App views={{ EventCalendar, UserProfile }} />
    </div>
  );
};

export default Scenario;
