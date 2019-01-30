import { connect } from "react-redux";
import EventCalendar from "../components/event-calendar/EventCalendar";

export default connect(
  (state, redux) => {
    const { events, auth } = state;
    const { EventDetails } = state.view;
    const signedIn = !!auth.user;
    const { inviteSuccess, currentEvent, currentEventType } = events || {};
    return {
      events,
      signedIn,
      inviteSuccess,
      views: {
        EventDetails
      },
      currentEvent,
      currentEventType
    };
  },
  dispatch => {
    return {
      initializeEvents: () => {}
    };
  }
)(EventCalendar);
