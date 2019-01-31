import { connect } from "react-redux";
import {
  asAction_showSettings,
  asAction_showMyPublicCalendar
} from "../store/event/eventAction";
import AppMenu from "../components/app-menu/AppMenu";

export default connect(
  (state, redux) => {
    var username = null;
    if (state.auth && state.auth.user) {
      username = state.auth.user.username;
    }
    return { username };
  },
  dispatch => {
    return {
      showSettings: () => {
        dispatch(asAction_showSettings());
      },
      viewMyPublicCalendar: name => {
        dispatch(asAction_showMyPublicCalendar(name));
      }
    };
  }
)(AppMenu);
