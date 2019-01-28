import { connect } from "react-redux";
import GuestList from "./GuestList";

function mapStateToProps(state) {
  var { events } = state;
  const guests = events.currentGuests;
  return {
    guests
  };
}

export default connect(mapStateToProps)(GuestList);
