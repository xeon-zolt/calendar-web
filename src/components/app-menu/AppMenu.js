import React, { Component } from "react";
import { Button, SplitButton, MenuItem } from "react-bootstrap";

export class AppMenu extends Component {
  render() {
    return (
      <SplitButton
        drop="down"
        variant="secondary"
        title="Drop down"
        id="dropdown-menu"
      >
        <MenuItem>Settings</MenuItem>
        <MenuItem divider={true} />
      </SplitButton>
    );
  }
}
