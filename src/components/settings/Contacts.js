import React, { Component } from "react";
import { Button } from "react-bootstrap";

const LINK_URL_BASE = "https://debutapp.social/";

const Contact = props => {
  const { contact, handleDataChange } = props;
  const linkUrl = LINK_URL_BASE + contact.username;
  var avatarUrl;
  if (
    contact.image &&
    contact.image.length > 0 &&
    contact.image[0].contentUrl
  ) {
    avatarUrl = contact.image[0].contentUrl;
  }
  var name = contact.name;
  if (!name) {
    name = contact.username;
  }
  return (
    <div>
      <input
        type="checkbox"
        checked={contact.selected}
        value={contact.selected}
        onChange={e => handleDataChange(e, "delete")}
      />
      {avatarUrl && (
        <img src={avatarUrl} height="16px" width="16px" alt="avatar" />
      )}
      {!avatarUrl && <span className="glyphicon glyphicon-user" />}
      <a href={linkUrl}>{name}</a>
    </div>
  );
};

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameToAdd: "",
      lookingUpContacts: false,
      selectedContacts: {}
    };
    this.bound = [
      "lookupContacts",
      "addContact",
      "deleteContacts",
      "handleContactChange"
    ].reduce((acc, d) => {
      acc[d] = this[d].bind(this);
      return acc;
    }, {});
  }
  handleContactChange(contact) {
    return (event, ref) => {
      const { selectedContacts } = this.state;
      if (ref === "delete") {
        selectedContacts[contact.username] = event.target.checked;
        this.setState({ selectedContacts });
      }
    };
  }
  renderContacts(contacts) {
    const list = [];
    for (var property in contacts) {
      if (contacts.hasOwnProperty(property)) {
        var contact = contacts[property];
        contact.username = property;
        list.push(
          <Contact
            key={property}
            contact={contact}
            handleDataChange={this.handleContactChange(contact)}
          />
        );
      }
    }
    if (list.length === 0) {
      list.push(<p key={0} />);
    }
    return list;
  }

  lookupContacts(event) {
    const { lookupContacts, contacts } = this.props;
    const contactQuery = event.target.value;

    this.setState({ lookingUpContacts: true, nameToAdd: contactQuery });
    const proposedContacts = [];
    for (var n in contacts) {
      const c = contacts[n];
      if (c && n.indexOf(contactQuery) >= 0) {
        proposedContacts.push(c);
      }
    }
    this.setState({ proposedContacts, lookingUpContacts: false });
    lookupContacts(contactQuery).then(
      proposedContacts =>
        this.setState({ proposedContacts, lookingUpContacts: false }),
      () => {
        this.setState({ lookingUpContacts: false });
      }
    );
  }

  addContact() {
    const { addContact } = this.props;
    const { nameToAdd } = this.state;
    addContact(nameToAdd, { username: nameToAdd });
    this.setState({ nameToAdd: "" });
  }

  deleteContacts() {
    const { deleteContacts, contacts } = this.props;
    const { selectedContacts } = this.state;
    const contactList = Object.values(contacts);
    const contactsToDelete = contactList.filter(
      c => selectedContacts[c.username]
    );
    deleteContacts(contactsToDelete);
    this.setState({ selectedContacts: {} });
  }

  render() {
    const { contacts } = this.props;
    const { lookupContacts, addContact, deleteContacts } = this.bound;
    const { selectedContacts, nameToAdd } = this.state;
    const contactsView = this.renderContacts(contacts);
    return (
      <div className="settings">
        <input
          type="text"
          placeholder="e.g. alice.id or bob.id.blockstack"
          onChange={lookupContacts}
        />
        <Button
          onClick={addContact}
          disabled={!nameToAdd || nameToAdd.length === 0}
        >
          Add
        </Button>
        {contactsView}
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={deleteContacts}
          disabled={
            !selectedContacts ||
            Object.keys(selectedContacts).filter(u => selectedContacts[u])
              .length === 0
          }
        >
          Delete
        </Button>
      </div>
    );
  }
}
