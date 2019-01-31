import React, { Component } from "react";
import ConnectedEventDetails from "./redux-event-details";
import ConnectedGuestList from "./redux-guest-list";

export function getViews(store) {
  const EventDetails = props => {
    return <ConnectedEventDetails store={store} {...props} />;
  };
  const GuestList = props => {
    return <ConnectedGuestList store={store} {...props} />;
  };

  return { EventDetails, GuestList };
}
