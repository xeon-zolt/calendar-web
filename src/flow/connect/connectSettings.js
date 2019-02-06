import { connect } from 'react-redux'
import { initializeEvents } from '../store/event/eventActionLazy'

import {
  addCalendar,
  deleteCalendars,
  setCalendarData,
  hideSettings,
} from '../store/event/calendarActionLazy'
import {
  addContact,
  deleteContacts,
  lookupContacts,
} from '../store/event/contactActionLazy'

export default connect(
  (state, redux) => {
    const show = state.events.showSettings
    const addCalendarUrl = state.events.showSettingsAddCalendarUrl
    const contacts = state.events.contacts
    const calendars = state.events.calendars
    return { show, contacts, calendars, addCalendarUrl }
  },
  dispatch => {
    return {
      handleHide: () => {
        dispatch(initializeEvents())
        dispatch(hideSettings())
      },
      lookupContacts: contactQuery => {
        return dispatch(lookupContacts(contactQuery))
      },
      addContact: contactFormData => {
        const username = contactFormData.username
        const contact = { username }
        dispatch(addContact(username, contact))
      },
      deleteContacts: contacts => {
        dispatch(deleteContacts(contacts))
      },
      addCalendar: calendar => {
        dispatch(addCalendar(calendar))
      },
      deleteCalendars: calendars => {
        dispatch(deleteCalendars(calendars))
      },
      setCalendarData: (calendar, data) => {
        dispatch(setCalendarData(calendar, data))
      },
    }
  }
)
