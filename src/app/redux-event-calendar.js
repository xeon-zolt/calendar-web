import { connect } from "react-redux";
import EventCalendar from "../components/event-calendar/EventCalendar";
import { showAllCalendars, hideInstructions } from "../store/event/eventAction";

export default connect(
  (state, redux) => {
    const { events, auth } = state;
    const { EventDetails } = state.lazy;
    const signedIn = !!auth.user;
    const {
      inviteSuccess,
      currentEvent,
      currentEventType,
      myPublicCalendar,
      myPublicCalendarIcsUrl,
      publicCalendarEvents,
      publicCalendar,
      showInstructions
    } = events || {};

    const showGeneralInstructions = showInstructions
      ? showInstructions.general
      : true;
    return {
      events,
      signedIn,
      inviteSuccess,
      views: { EventDetails },
      currentEvent,
      currentEventType,
      myPublicCalendar,
      myPublicCalendarIcsUrl,
      publicCalendarEvents,
      publicCalendar,
      showGeneralInstructions
    };
  },
  dispatch => {
    return {
      initializeEvents: () => {},
      showAllCalendars: () => {
        dispatch(showAllCalendars());
      },
      hideInstructions: () => {
        dispatch(hideInstructions());
      }
    };
  }
)(EventCalendar);
