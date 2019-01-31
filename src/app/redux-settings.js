import { connect } from "react-redux";
import { HIDE_SETTINGS } from "../store/ActionTypes";
import Settings from "../components/settings/Settings";

export default connect(
  (state, redux) => {
    const show = state.events.showSettings;
    const contacts = state.events.contacts;
    const calendars = state.events.calendars;
    return { show, contacts, calendars };
  },
  dispatch => {
    return {
      handleHide: () => {
        dispatch({ type: HIDE_SETTINGS });
      },
      lookupContacts: () => {},
      addContact: () => {},
      deleteContacts: () => {},
      addCalendar: () => {}
    };
  }
)(Settings);
