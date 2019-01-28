import React, { Component } from "react";
import { connect } from "react-redux";
import EventDetails from "./EventDetails";
import { LoadGuestList, SendInvites } from "../../store/eventAction";

function mapStateToProps(state) {
  const inviteError = state.events.inviteError;
  const inviteSuccess = state.events.inviteSuccess;
  console.log("events mapStateToProps", state.events);
  return {
    inviteError,
    inviteSuccess
  };
}

function mapDispatchToProps(dispatch) {
  return {
    LoadGuestList: (guests, details) =>
      dispatch(LoadGuestList(guests, details)),
    SendInvites: (details, eventType) =>
      dispatch(SendInvites(details, eventType))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventDetails);
