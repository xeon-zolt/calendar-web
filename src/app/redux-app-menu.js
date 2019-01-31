import { connect } from "react-redux";
import { SHOW_SETTINGS, VIEW_MY_CALENDAR } from "../store/ActionTypes";
import AppMenu from "../components/app-menu/AppMenu";

export default connect(
  (state, redux) => {
    return {};
  },
  dispatch => {
    return {
      viewSettings: () => {
        dispatch({ type: SHOW_SETTINGS });
      },
      viewPublicCalendar: () => {
        dispatch({ type: VIEW_MY_CALENDAR });
      }
    };
  }
)(AppMenu);
