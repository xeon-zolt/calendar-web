import { connect } from "react-redux";
import GuestList from "../components/event-guest-list/GuestList";

export default connect((state, redux) => {
  console.log("[ConnectedGuestList]", state, redux.store);
  return {
    guests: state.events.currentGuests
  };
})(GuestList);
