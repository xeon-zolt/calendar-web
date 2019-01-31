import React, { Component } from "react";
import { SplitButton, MenuItem } from "react-bootstrap";

export class AppMenu extends Component {
  render() {
    return (
      <SplitButton
        drop="down"
        variant="secondary"
        title="Settings"
        id="dropdown-menu"
      >
        <MenuItem>Calendars</MenuItem>
        <MenuItem divider={true} />
      </SplitButton>
    );
  }
}
