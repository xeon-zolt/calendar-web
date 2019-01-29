import React, { Component } from "react";
import { connect } from "react-redux";
import EventDetails from "./EventDetails";
import { LoadGuestList, SendInvites } from "../../store/eventAction";
import * as types from "../../store/eventActionTypes";
import GuestList from "../event-guest-list/redux-connect";

function mapStateToProps(state) {
  const inviteError = state.events.inviteError;
  const inviteSuccess = state.events.inviteSuccess;
  console.log("events mapStateToProps", state.events);
  return {
    inviteError,
    inviteSuccess,
    GuestList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadGuestList: (guests, details) =>
      dispatch(LoadGuestList(guests, details)),
    sendInvites: (details, eventType) =>
      dispatch(SendInvites(details, eventType)),
    deleteEvent: id => dispatch({ type: types.REMOVE_EVENT, payload: id }),
    addEvent: obj => dispatch({ type: types.ADD_EVENT, payload: obj }),
    updateEvent: obj =>
      dispatch({ type: types.UPDATE_EVENT, payload: { id: obj.id, obj: obj } })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventDetails);
