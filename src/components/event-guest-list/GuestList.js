import React, { Component } from "react";
import { ProgressBar, OverlayTrigger, Tooltip } from "react-bootstrap";

const GUEST_BASE = "https://debutapp.social/";

function renderGuestList(guests) {
  var list = [];
  for (var property in guests) {
    if (guests.hasOwnProperty(property)) {
      var guest = guests[property];
      list.push(<Guest key={property} guest={guest} username={property} />);
    }
  }
  return list;
}

export const Guest = ({ guest, username }) => {
  const guestUrl = GUEST_BASE + username;
  var avatarUrl;
  if (guest.image && guest.image.length > 0 && guest.image[0].contentUrl) {
    avatarUrl = guest.image[0].contentUrl;
  } else {
    avatarUrl = "/images/avatar.png";
  }
  var name = guest.name;
  if (!name) {
    name = guest.username;
  }
  const commMethodUrl = "/images/oichat.png";
  return (
    <div>
      <img src={avatarUrl} height="16px" alt="avatar" />
      <a href={guestUrl}>{name}</a>
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip id={`tooltip`}>
            OI Chat (chat.openintents.org) is a matrix service of Blockstack.
          </Tooltip>
        }
      >
        <span>
          (via
          <img src={commMethodUrl} height="16px" alt="avatar" />)
        </span>
      </OverlayTrigger>
    </div>
  );
};

class GuestList extends Component {
  render() {
    const guests = this.props.guests;
    const numberOfGuests = this.props.guestsCount || 1;
    const numberOfGuestsLoaded = this.props.guestsLoaded || 0;
    let guestView;

    if (guests) {
      guestView = renderGuestList(guests);
    } else if (numberOfGuests > 0) {
      guestView = (
        <div>
          loading guests' details..
          <br />
          <ProgressBar
            active
            now={((numberOfGuestsLoaded + 1) * 100) / (numberOfGuests + 1)}
          />
        </div>
      );
    } else {
      guestView = <div>There is nobody on the guest list..</div>;
    }
    return <section>{guestView}</section>;
  }
}

export default GuestList;
