import { connect } from "react-redux";
import EventCalendar from "../components/event-calendar/EventCalendar";

import { getInitialEvents } from "../store/event/eventAction";

export default connect(
  (state, redux) => {
    console.log("[ConnectedEventCalendar2]", state, redux.store);
    const { events, auth } = state;
    const { EventDetails } = redux.store.views;
    const signedIn = !!auth.user;
    const { inviteSuccess, currentEvent } = events || {};
    return {
      events,
      signedIn,
      inviteSuccess,
      views: {
        EventDetails
      },
      currentEvent
    };
  },
  dispatch => {
    return {
      getInitialEvents: search => dispatch(getInitialEvents(search))
    };
  }
)(EventCalendar);
