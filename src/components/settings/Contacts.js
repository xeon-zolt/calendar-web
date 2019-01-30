import React, { Component } from "react";
import { Button } from "react-bootstrap";

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
    avatarUrl = "/images/avatar.png";
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

  render() {
    const { contacts } = this.props;
    const contactsView = this.renderContacts(contacts);
    return (
      <div className="settings">
        {contactsView}
        <Button bsStyle="success" onClick={() => deleteContacts()}>
          Delete
        </Button>
        <Button bsStyle="success" onClick={() => addContacts()}>
          Add
        </Button>
      </div>
    );
  }
}
