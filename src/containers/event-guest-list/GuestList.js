import React, { Component } from "react";
import { ProgressBar } from "react-bootstrap";

const GUEST_BASE = "https://debutapp.social/";

function renderGuestList(guests) {
  var list = [];
  for (var property in guests) {
    if (guests.hasOwnProperty(property)) {
      var guest = guests[property];
      guest.username = property;
      console.log("g", guest);
      list.push(<Guest key={property} guest={guest} />);
    }
  }
  return list;
}

const Guest = ({ guest }) => {
  console.log("UI guest", guest);
  const guestUrl = GUEST_BASE + guest.username;
  return (
    <div>
      <a href={guestUrl}>{guest.name}</a>
    </div>
  );
};

class GuestList extends Component {
  render() {
    console.log("UI props", this.props);
    const guests = this.props.guests;
    let guestView;

    if (guests) {
      guestView = renderGuestList(guests);
    } else {
      guestView = (
        <div>
          loading guests' details..
          <br />
          <ProgressBar active now={50} />
        </div>
      );
    }
    return <section>{guestView}</section>;
  }
}

export default GuestList;
