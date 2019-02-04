import { connect } from "react-redux";
import {
  addCalendar,
  deleteCalendars,
  setCalendarData,
  hideSettings
} from "../store/event/calendarActionLazy";
import { addContact, deleteContacts } from "../store/event/contactActionLazy";

export default connect(
  (state, redux) => {
    const show = state.events.showSettings;
    const addCalendarUrl = state.events.showSettingsAddCalendarUrl;
    const contacts = state.events.contacts;
    const calendars = state.events.calendars;
    return { show, contacts, calendars, addCalendarUrl };
  },
  dispatch => {
    return {
      handleHide: () => {
        dispatch(hideSettings());
      },
      lookupContacts: contactQuery => {
        return Promise.reject("not yet implemented");
      },
      addContact: (username, contact) => {
        dispatch(addContact(username, contact));
      },
      deleteContacts: contacts => {
        dispatch(deleteContacts(contacts));
      },
      addCalendar: calendar => {
        dispatch(addCalendar(calendar));
      },
      deleteCalendars: calendars => {
        dispatch(deleteCalendars(calendars));
      },
      setCalendarData: (calendar, data) => {
        dispatch(setCalendarData(calendar, data));
      }
    };
  }
);
