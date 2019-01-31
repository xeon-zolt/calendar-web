import React, { Component } from "react";
import Calendars from "./Calendars";
import Contacts from "./Contacts";

export class Settings extends Component {
  render() {
    return (
      <Modal>
        <label>Calendars</label>
        <Calendars />
        <label>Contacts</label>
        <Contacts />
      </Modal>
    );
  }
}
