import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import Calendars from "./Calendars";
import Contacts from "./Contacts";

class SettingsPanel extends Component {
  render() {
    const { show, handleHide, CalendarsContent, ContactsContent } = this.props;
    return (
      <Modal show={show} onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>{CalendarsContent}</Modal.Body>
        <Modal.Body>{ContactsContent}</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

class SettingsPage extends Component {
  render() {
    const { show, handleHide, CalendarsContent, ContactsContent } = this.props;
    return (
      <div className="text-left" style={{ marginLeft: 100 }}>
        <h4>Settings</h4>
        {CalendarsContent}
        {ContactsContent}
      </div>
    );
  }
}

export default class Settings extends Component {
  render() {
    const {
      show,
      handleHide,
      calendars,
      addCalendarUrl,
      contacts,
      addCalendar,
      deleteCalendars,
      lookupContacts,
      addContact,
      deleteContacts
    } = this.props;
    const CalendarsContent = (
      <div>
        <label>Calendars</label>
        <Calendars
          calendars={calendars}
          addCalendar={addCalendar}
          deleteCalendars={deleteCalendars}
          addCalendarUrl={addCalendarUrl}
        />
      </div>
    );

    const ContactsContent = (
      <div>
        <label>Contacts</label>
        <Contacts
          contacts={contacts}
          lookupContacts={lookupContacts}
          addContact={addContact}
          deleteContacts={deleteContacts}
        />
      </div>
    );

    return (
      <SettingsPage
        CalendarsContent={CalendarsContent}
        ContactsContent={ContactsContent}
      />
    );
  }
}
