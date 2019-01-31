import React, { Component } from "react";
import { SplitButton, MenuItem } from "react-bootstrap";

export class AppMenu extends Component {
  render() {
    return (
      <SplitButton
        drop="down"
        variant="secondary"
        title="Menu"
        id="dropdown-menu"
      >
        <MenuItem>Settings</MenuItem>
        <MenuItem>View public calendar</MenuItem>
        <MenuItem>Export data</MenuItem>
        <MenuItem>Support</MenuItem>
        <MenuItem divider={true} />
        <MenuItem>Logout</MenuItem>
      </SplitButton>
    );
  }
}
