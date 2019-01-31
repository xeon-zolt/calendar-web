import React from "react";
import ConnectedEventDetails from "./redux-event-details";
import ConnectedGuestList from "./redux-guest-list";
import ConnectedUserProfile from "./redux-user-profile";

export function getViews(store) {
  const EventDetails = props => {
    return <ConnectedEventDetails store={store} {...props} />;
  };
  const GuestList = props => {
    return <ConnectedGuestList store={store} {...props} />;
  };
  const UserProfile = props => {
    return <ConnectedUserProfile store={store} {...props} />;
  };

  return { EventDetails, GuestList, UserProfile };
}
