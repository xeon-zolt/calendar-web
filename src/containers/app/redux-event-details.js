import React, { Component } from "react";
import { connect } from "react-redux";
import EventDetails from "../event-details/EventDetails";
import { LoadGuestList, SendInvites } from "../../store/eventAction";
import * as types from "../../store/eventActionTypes";

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
      deleteEvent: id => dispatch({ type: types.REMOVE_EVENT, payload: id }),
      addEvent: obj => dispatch({ type: types.ADD_EVENT, payload: obj }),
      updateEvent: obj =>
        dispatch({
          type: types.UPDATE_EVENT,
          payload: { id: obj.id, obj: obj }
        })
    };
  }
)(EventDetails);
