import React from "react";
import ConnectedEventDetails from "./redux-event-details";
import ConnectedGuestList from "./redux-guest-list";
import ConnectedUserProfile from "./redux-user-profile";
import ConnectedSettings from "./redux-settings";
import ConnectedAppMenu from "./redux-app-menu";

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

  const Settings = props => {
    return <ConnectedSettings store={store} {...props} />;
  };

  const AppMenu = props => {
    return <ConnectedAppMenu store={store} {...props} />;
  };

  return { EventDetails, GuestList, UserProfile, Settings, AppMenu };
}
