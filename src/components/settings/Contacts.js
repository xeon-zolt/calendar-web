import React, { Component } from "react";
import { Button } from "react-bootstrap";

import avatarDefault from "./avatar.png";

const LINK_URL_BASE = "https://debutapp.social/";

const Contact = props => {
  const { contact } = props;
  const linkUrl = LINK_URL_BASE + contact.username;
  var avatarUrl;
  if (
    contact.image &&
    contact.image.length > 0 &&
    contact.image[0].contentUrl
  ) {
    avatarUrl = contact.image[0].contentUrl;
  } else {
    avatarUrl = avatarDefault;
  }
  var name = contact.name;
  if (!name) {
    name = contact.username;
  }
  return (
    <div>
      <input type="checkbox" />
      <img src={avatarUrl} height="16px" alt="avatar" />
      <a href={linkUrl}>{name}</a>
    </div>
  );
};

export class Contacts extends Component {
  renderContacts(contacts) {
    const list = [];
    for (var property in contacts) {
      if (contacts.hasOwnProperty(property)) {
        var contact = contacts[property];
        contact.username = property;
        list.push(<Contact key={property} contact={contact} />);
      }
    }
    return list;
  }

  lookupContacts(contactQuery) {
    this.setState({ lookingUpContacts: true });
    const { lookupContacts } = this.props;
    lookupContacts(contactQuery).then(proposedContacts =>
      this.setState({ proposedContacts, lookingUpContacts: false })
    );
  }

  render() {
    const { contacts } = this.props;
    const contactsView = this.renderContacts(contacts);
    return (
      <div className="settings">
        <input
          type="text"
          onChange={e => {
            this.lookupContacts(e.target.value);
          }}
        />
        <Button onClick={() => this.addContact()}>Add</Button>
        {contactsView}
        <Button bsStyle="danger" onClick={() => this.deleteContacts()}>
          Delete
        </Button>
      </div>
    );
  }
}
