import React, { Component } from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";

export default class AppMenu extends Component {
  constructor(props) {
    super(props);
    this.bound = ["onSelect"].reduce((acc, d) => {
      acc[d] = this[d].bind(this);
      return acc;
    }, {});
  }

  onSelect(eventKey) {
    switch (eventKey) {
      case "settings":
        this.props.showSettings();
        break;
      case "publicCalendar":
        this.props.viewMyPublicCalendar("public@" + this.props.username);
        break;
      case "showFiles":
        this.props.showFiles();
        break;
      default:
        console.warn("invalid menu item ", eventKey);
        break;
    }
  }
  render() {
    const { onSelect } = this.bound;
    const { username, signedIn } = this.props;
    return (
      signedIn && (
        <div style={{ margin: "4px" }}>
          <DropdownButton
            drop="down"
            bsStyle="default"
            title="Menu"
            id="dropdown-menu"
            pullRight
            onSelect={onSelect}
          >
            <MenuItem eventKey="settings">Settings</MenuItem>
            {username && (
              <MenuItem eventKey="publicCalendar">
                View public calendar
              </MenuItem>
            )}
            {username && (
              <MenuItem eventKey="showFiles">View your data</MenuItem>
            )}
          </DropdownButton>
        </div>
      )
    );
  }
}
