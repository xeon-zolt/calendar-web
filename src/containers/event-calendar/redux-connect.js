import { connect } from "react-redux";
import EventCalendar from "./EventCalendar";

import * as eventAction from "../../store/eventAction";
import EventDetails from "../event-details/redux-connect";

function mapStateToProps(state) {
  var { events, auth } = state;
  const signedIn = !!auth.user;
  const inviteSuccess = events.inviteSuccess;
  console.log("alllEvents", events.allEvents);
  return {
    events,
    signedIn,
    inviteSuccess,
    EventDetails
  };
}

function mapDispatchToProps(dispatch) {
  return {
    GetInitialEvents: search => dispatch(eventAction.GetInitialEvents(search))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventCalendar);
