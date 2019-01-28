import React, { Component } from "react";

import { Modal, Button, ProgressBar, Switch } from "react-bootstrap";
import moment from "moment";
import GuestList from "../event-guest-list/redux-connect";

import "../../css/datetime.css";

var Datetime = require("react-datetime");

function checkHasGuests(str) {
  if (!str || !str.length) {
    return false;
  }
  const guests = str.split(/[,\s]+/g);
  return guests.filter(g => g.length > 0).length > 0;
}
class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInvitesModal: false,
      eventDetail: {
        id: this.props.eventIndex,
        title:
          this.props.eventInfo && this.props.eventInfo.title
            ? this.props.eventInfo.title
            : null,
        start:
          this.props.eventInfo && this.props.eventInfo.start
            ? this.props.eventInfo.start
            : moment(),
        end:
          this.props.eventInfo && this.props.eventInfo.end
            ? this.props.eventInfo.end
            : moment,
        allDay: this.props.eventInfo.allDay ? true : false,
        hexColor: "#265985",
        notes: this.props.eventInfo.notes ? this.props.eventInfo.notes : "",
        guests: this.props.eventInfo.guests ? this.props.eventInfo.guests : ""
      },
      sending: false
    };

    this.bound = [
      "handleDataChange",
      "handleInvitesHide",
      "showInvitesModal",
      "sendInvites",
      "addEvent",
      "updateEvent",
      "deleteEvent"
    ].reduce((acc, d) => {
      acc[d] = this[d].bind(this);
      return acc;
    }, {});
  }

  componentWillReceiveProps(nextProps) {
    const { showInvitesModal, sending } = this.state;

    console.log(
      "showInvitesModal",
      showInvitesModal,
      nextProps.inviteSuccess,
      !!nextProps.inviteError
    );
    console.log(
      "willReceiveProps",
      nextProps,
      JSON.stringify(nextProps.eventInfo),
      nextProps.eventType
    );

    const {
      id,
      title,
      start,
      end,
      allDay,
      hexColor,
      notes,
      guests,
      owner
    } = nextProps.eventInfo || {
      start: moment(),
      end: moment(),
      allDay: false,
      hexColor: "#265985"
    };

    this.setState({
      eventDetail: {
        id: nextProps.eventType === "add" ? nextProps.eventIndex : id,
        title,
        start,
        end,
        allDay,
        hexColor,
        notes,
        guests,
        owner
      },
      showInvitesModal:
        showInvitesModal &&
        !(!!nextProps.inviteSuccess || !!nextProps.inviteError),
      sending:
        sending && !(!!nextProps.inviteSuccess || !!nextProps.inviteError)
    });
  }

  handleDataChange(e, ref) {
    var eventDetail = this.state.eventDetail;
    var val = "";
    if (ref !== "allDay" && ref !== "public") {
      if (ref === "start" || ref === "end") {
        val = new Date(moment(e));
      } else {
        val = e.target.value;
      }
    } else {
      val = e.target.checked;
    }

    eventDetail[ref] = val;
    this.setState({ eventDetail });
  }

  addEvent() {
    const eventDetail = this.state.eventDetail;
    console.log(
      "add event",
      eventDetail.noInvites,
      checkHasGuests(eventDetail.guests)
    );
    if (eventDetail.noInvites || !checkHasGuests(eventDetail.guests)) {
      this.props.addEvent(eventDetail);
      this.props.handleHide();
    } else {
      this.showInvitesModal();
    }
  }

  deleteEvent(id) {
    console.log("deleteEvent");
    this.props.deleteEvent(id);
    this.props.handleHide();
  }

  updateEvent(obj) {
    this.props.updateEvent(obj);
    this.props.handleHide();
  }

  showInvitesModal() {
    const guestsString = this.state.eventDetail.guests;
    const guests = guestsString.split(/[,\s]+/g);
    console.log("dipatch load guest list", guests);
    this.props.loadGuestList(guests, this.state.eventDetail);
    this.setState({ showInvitesModal: true });
  }

  handleInvitesHide() {
    this.setState({ showInvitesModal: false });
    const eventDetail = this.state.eventDetail;
    eventDetail.noInvites = true;
  }

  sendInvites() {
    this.setState({ sending: true });
    this.props.sendInvites(this.state.eventDetail, this.props.eventType);
  }

  render() {
    const { eventDetail } = this.state;
    const { handleHide } = this.props;
    const {
      handleDataChange,
      handleInvitesHide,
      showInvitesModal,
      sendInvites,
      addEvent,
      updateEvent,
      deleteEvent
    } = this.bound;
    const hasGuests = checkHasGuests(eventDetail.guests);
    var inviteErrorMsg = [];
    if (this.props.inviteError) {
      const error = this.props.inviteError;
      if (error.errcode === "M_CONSENT_NOT_GIVEN") {
        var linkUrl = error.message.substring(
          error.message.indexOf("https://openintents.modular.im"),
          error.message.length - 1
        );
        inviteErrorMsg = (
          <div>
            Sending not possible. Please review{" "}
            <a target="_blank" rel="noopener noreferrer" href={linkUrl}>
              the T&amp;C of your chat provider
            </a>{" "}
            openintents.modular.im (OI Chat)
          </div>
        );
      }
    }
    return (
      <Modal show={true} onHide={this.props.handleHide}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label> Event Name </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter the Event Name"
            ref="title"
            value={this.state.eventDetail.title}
            onChange={e => handleDataChange(e, "title")}
          />

          <label> Start Date </label>
          {this.state.eventDetail.allDay ? (
            <Datetime
              value={this.state.eventDetail.start}
              dateFormat="MM-DD-YYYY"
              timeFormat={false}
              onChange={e => handleDataChange(e, "start")}
            />
          ) : (
            <Datetime
              value={this.state.eventDetail.start}
              onChange={e => handleDataChange(e, "start")}
            />
          )}

          <label> End Date </label>
          {this.state.eventDetail.allDay ? (
            <Datetime
              value={this.state.eventDetail.end}
              dateFormat="MM-DD-YYYY"
              timeFormat={false}
              onChange={e => handleDataChange(e, "end")}
            />
          ) : (
            <Datetime
              value={this.state.eventDetail.end}
              onChange={e => handleDataChange(e, "end")}
            />
          )}

          <label> Event Notes </label>
          <textarea
            className="form-control"
            placeholder="Event Notes"
            ref="notes"
            value={this.state.eventDetail.notes}
            onChange={e => handleDataChange(e, "notes")}
          />

          <label> Guests </label>
          <textarea
            className="form-control"
            placeholder="Event guests"
            ref="guests"
            value={this.state.eventDetail.guests}
            onChange={e => handleDataChange(e, "guests")}
          />

          <label> Event Color </label>
          <input
            type="color"
            value={this.state.eventDetail.hexColor}
            onChange={e => handleDataChange(e, "hexColor")}
            style={{ marginRight: "20px", marginLeft: "5px" }}
          />

          <input
            type="checkBox"
            name="all_Day"
            value={this.state.eventDetail.id}
            checked={this.state.eventDetail.allDay}
            onChange={e => handleDataChange(e, "allDay")}
          />
          <label> All Day </label>
          <input
            type="checkBox"
            name="public"
            value={this.state.eventDetail.public}
            checked={this.state.eventDetail.public}
            onChange={e => handleDataChange(e, "public")}
          />
          <label> Public </label>
        </Modal.Body>
        <Modal.Footer>
          {this.props.eventType === "add" ? null : (
            <Button
              bsStyle="warning"
              enabled={{ hasGuests }}
              onClick={() => showInvitesModal()}
            >
              Send Invites
            </Button>
          )}
          {this.props.eventType === "add" ? (
            <Button bsStyle="success" onClick={() => addEvent()}>
              Add
            </Button>
          ) : (
            <Button
              bsStyle="warning"
              onClick={() => updateEvent(this.state.eventDetail)}
            >
              Update
            </Button>
          )}
          {this.props.eventType === "add" ? null : (
            <Button
              bsStyle="danger"
              onClick={() => deleteEvent(this.state.eventDetail.id)}
            >
              Delete
            </Button>
          )}
          <Button onClick={handleHide}>Close</Button>
        </Modal.Footer>

        <Modal show={this.state.showInvitesModal} onHide={handleInvitesHide}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              {this.state.eventDetail.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Send invites according to their Blockstack settings:
            <GuestList guests={this.state.eventDetail.guests} />
            {this.state.sending && !this.props.inviteError && (
              <ProgressBar active now={50} />
            )}
            {this.props.inviteError && inviteErrorMsg}
            <Modal.Footer>
              <Button bsStyle="success" onClick={() => sendInvites()}>
                Send
              </Button>
              <Button onClick={handleInvitesHide}>Close</Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      </Modal>
    );
  }
}

export default EventDetails;
