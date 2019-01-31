import { connect } from "react-redux";
import EventDetails from "../components/event-details/EventDetails";
import {
  loadGuestList,
  sendInvites,
  addEvent,
  deleteEvent,
  updateEvent
} from "../store/event/eventAction";

export default connect(
  (state, redux) => {
    console.log("[[ConnectedEventDetails]]", state, redux.store);
    const { GuestList } = state.lazy;
    const inviteError = state.events.inviteError;
    const inviteSuccess = state.events.inviteSuccess;
    return {
      inviteError,
      inviteSuccess,
      views: { GuestList }
    };
  },
  dispatch => {
    return {
      loadGuestList: (guests, details) =>
        dispatch(loadGuestList(guests, details)),
      sendInvites: (details, guests, eventType) =>
        dispatch(sendInvites(details, guests, eventType)),
      deleteEvent: obj => dispatch(deleteEvent(obj)),
      addEvent: obj => dispatch(addEvent(obj)),
      updateEvent: obj => dispatch(updateEvent(obj))
    };
  }
)(EventDetails);
