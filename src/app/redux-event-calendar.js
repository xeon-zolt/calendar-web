import { connect } from "react-redux";
import EventCalendar from "../components/event-calendar/EventCalendar";
import { asAction_showAllCalendars } from "../store/event/eventAction";

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
      publicCalendarEvents,
      publicCalendar
    } = events || {};
    return {
      events,
      signedIn,
      inviteSuccess,
      views: { EventDetails },
      currentEvent,
      currentEventType,
      myPublicCalendar,
      publicCalendarEvents,
      publicCalendar
    };
  },
  dispatch => {
    return {
      initializeEvents: () => {},
      showAllCalendars: () => {
        dispatch(asAction_showAllCalendars());
      }
    };
  }
)(EventCalendar);
