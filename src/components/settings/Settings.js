import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

import Calendars from './Calendars'
import Contacts from './Contacts'

// class SettingsPanel extends Component {
//   render() {
//     const { show, handleHide, CalendarsContent, ContactsContent } = this.props
//     return (
//       <Modal show={show} onHide={handleHide}>
//         <Modal.Header closeButton>
//           <Modal.Title id="contained-modal-title">Settings</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{CalendarsContent}</Modal.Body>
//         <Modal.Body>{ContactsContent}</Modal.Body>
//         <Modal.Footer>
//           <Button onClick={handleHide}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     )
//   }
// }

class SettingsPage extends Component {
  render() {
    const { CalendarsContent, ContactsContent, handleHide } = this.props
    return (
      <div className="text-left" style={{ marginLeft: 100 }}>
        <h4>Settings</h4>
        {CalendarsContent}
        {ContactsContent}
        <Button onClick={handleHide}>Done</Button>
      </div>
    )
  }
}

export default class Settings extends Component {
  render() {
    const {
      // show,
      handleHide,
      calendars,
      addCalendarUrl,
      contacts,
      addCalendar,
      deleteCalendars,
      setCalendarData,
      lookupContacts,
      addContact,
      deleteContacts,
    } = this.props
    const CalendarsContent = (
      <div>
        <label>Calendars</label>
        <Calendars
          items={calendars}
          addItem={addCalendar}
          deleteItems={deleteCalendars}
          setItemData={setCalendarData}
          valueOfAdd={addCalendarUrl}
        />
      </div>
    )

    const ContactsContent = (
      <div>
        <label>Contacts</label>
        <Contacts
          items={Object.values(contacts || {})}
          lookupContacts={lookupContacts}
          addItem={addContact}
          deleteItems={deleteContacts}
        />
      </div>
    )

    return (
      <SettingsPage
        CalendarsContent={CalendarsContent}
        ContactsContent={ContactsContent}
        handleHide={handleHide}
      />
    )
  }
}
