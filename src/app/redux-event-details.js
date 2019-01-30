import { connect } from "react-redux";
import EventDetails from "../components/event-details/EventDetails";
import { LoadGuestList, SendInvites } from "../store/event/eventAction";
import { REMOVE_EVENT, ADD_EVENT, UPDATE_EVENT } from "../store/ActionTypes";

export default connect(
  (state, redux) => {
    console.log("[[ConnectedEventDetails]]", state, redux.store);
    const { GuestList } = redux.store.views;
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
        dispatch(LoadGuestList(guests, details)),
      sendInvites: (details, guests, eventType) =>
        dispatch(SendInvites(details, guests, eventType)),
      deleteEvent: obj => dispatch({ type: REMOVE_EVENT, payload: { obj } }),
      addEvent: obj => dispatch({ type: ADD_EVENT, payload: obj }),
      updateEvent: obj =>
        dispatch({
          type: UPDATE_EVENT,
          payload: { id: obj.id, obj: obj }
        })
    };
  }
)(EventDetails);
