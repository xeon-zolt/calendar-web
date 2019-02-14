import { connect } from 'react-redux'
import {
  initializeEvents,
  showAllCalendars,
  verifyAddCalendar,
  clearVerifyCalendar,
} from '../store/event/eventActionLazy'

import {
  addCalendar,
  deleteCalendars,
  setCalendarData,
} from '../store/event/calendarActionLazy'
import {
  addContact,
  deleteContacts,
  lookupContacts,
} from '../store/event/contactActionLazy'
import { uuid } from '../io/eventFN'

export default connect(
  (state, redux) => {
    const show = state.events.showSettings
    const addCalendarUrl = state.events.showSettingsAddCalendarUrl
    var contacts = state.events.contacts
    const calendars = state.events.calendars
    const user = state.auth.user
    const verifyAddCalendarData = state.events.verifyAddCalendarData
    return {
      show,
      contacts,
      calendars,
      addCalendarUrl,
      user,
      verifyAddCalendarData,
    }
  },
  (dispatch, redux) => {
    return {
      handleHide: () => {
        dispatch(initializeEvents())
        dispatch(showAllCalendars())
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
        dispatch(clearVerifyCalendar())
      },
      deleteCalendars: calendars => {
        dispatch(deleteCalendars(calendars))
      },
      setCalendarData: (calendar, data) => {
        dispatch(setCalendarData(calendar, data))
      },
      followContact: contact => {
        const calendar = {
          uid: uuid(),
          type: 'blockstack-user',
          name: 'public@' + contact.username,
          mode: 'read-only',
          data: {
            user: contact.username,
            src: 'public/AllEvents',
          },
        }
        dispatch(addCalendar(calendar))
      },
      unfollowContact: contact => {
        const { calendars } = redux.store.getState().events
        const calendarToDelete = calendars.find(
          c => (c.name = 'public@' + contact.username)
        )
        dispatch(deleteCalendars([calendarToDelete]))
      },
      verifyAddCalendar: calendar => {
        dispatch(verifyAddCalendar(calendar))
      },
    }
  }
)
