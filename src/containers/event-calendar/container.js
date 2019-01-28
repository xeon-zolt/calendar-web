import { connect } from "react-redux";
import EventCalendar from "./EventCalendar";

import * as eventAction from "../../store/eventAction";
import * as types from "../../store/eventActionTypes";

function mapStateToProps(state) {
  var { events, auth } = state;
  const signedIn = !!auth.user;
  const inviteSuccess = events.inviteSuccess;
  console.log("alllEvents", events.allEvents);
  return {
    events,
    signedIn,
    inviteSuccess
  };
}

function mapDispatchToProps(dispatch) {
  return {
    GetInitialEvents: search => dispatch(eventAction.GetInitialEvents(search)),
    DeleteEvent: id => dispatch({ type: types.REMOVE_EVENT, payload: id }),
    AddEvent: obj => dispatch({ type: types.ADD_EVENT, payload: obj }),
    UpdateEvent: obj =>
      dispatch({ type: types.UPDATE_EVENT, payload: { id: obj.id, obj: obj } })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventCalendar);
