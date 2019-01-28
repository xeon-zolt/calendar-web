import React, { Component } from "react";
import moment from "moment";
import { Modal } from "react-bootstrap";
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import EventDetails from "../event-details/container";

let localizer = BigCalendar.momentLocalizer(moment);
let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class EventCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      eventType: "add",
      newIndex: 0,
      eventInfo: {}
    };
    this.handleHide = this.handleHide.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
  }

  componentWillMount() {
    this.props.GetInitialEvents(window.location.search);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inviteSuccess) {
      this.setState({ showModal: false });
    }
  }
  handleHide() {
    this.setState({ showModal: false });
  }

  handleShow(slotInfo, eventType) {
    var currentIndex = this.props.events.allEvents.length;
    console.log("handleShow", eventType);
    this.setState({
      showModal: true,
      eventType: eventType,
      eventInfo: slotInfo,
      newIndex: currentIndex
    });
  }

  deleteEvent(id) {
    this.props.DeleteEvent(id);
    this.setState({ showModal: false });
  }

  addEvent(obj) {
    this.props.AddEvent(obj);
    this.setState({ showModal: false });
  }

  updateEvent(obj) {
    this.props.AddEvent(obj);
    this.setState({ showModal: false });
  }

  eventStyle(event, start, end, isSelected) {
    var bgColor = event.hexColor ? event.hexColor : "#265985";
    var style = {
      backgroundColor: bgColor,
      borderRadius: "5px",
      opacity: 1,
      color: "white",
      border: "0px",
      display: "block"
    };
    return {
      style: style
    };
  }

  getEventStart(eventInfo) {
    return new Date(eventInfo.start);
  }

  getEventEnd(eventInfo) {
    return new Date(eventInfo.end);
  }

  render() {
    const signedIn = this.props.signedIn;
    console.log("allevents", this.props.events.allEvents);
    return (
      <div className="bodyContainer">
        <div className="well well-sm">
          {signedIn && (
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">Instructions</Modal.Title>
              <strong>To add an event: </strong> Click on the day you want to
              add an event or drag up to the day you want to add the event for
              multiple day event! <br />
              <strong>To update and delete an event:</strong> Click on the event
              you wish to update or delete!
            </Modal.Header>
          )}
          {!signedIn && (
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">
                Private, Encrypted Calendar in the Cloud
              </Modal.Title>
              <strong>To learn about Blockstack: </strong> A good starting point
              is{" "}
              <a href="https://docs.blockstack.org">
                Blockstack's documentation
              </a>
              .<br />
              <strong>I have already a Blockstack ID:</strong> Just sign in
              using the blockstack button above!
            </Modal.Header>
          )}
        </div>
        <EventDetails
          showModal={this.state.showModal}
          handleHide={this.handleHide}
          eventType={this.state.eventType}
          eventInfo={this.state.eventInfo}
          newIndex={this.state.newIndex}
          deleteEvent={this.deleteEvent}
          addEvent={this.addEvent}
          updateEvent={this.updateEvent}
        />
        <BigCalendar
          localizer={localizer}
          selectable={this.props.signedIn}
          events={this.props.events.allEvents}
          views={allViews}
          step={60}
          showMultiDayTimes
          defaultDate={new Date(moment())}
          onSelectEvent={event => this.handleShow(event, "edit")}
          onSelectSlot={slotInfo => this.handleShow(slotInfo, "add")}
          style={{ minHeight: "500px" }}
          eventPropGetter={this.eventStyle}
          startAccessor={this.getEventStart}
          endAccessor={this.getEventEnd}
        />
      </div>
    );
  }
}

export default EventCalendar;
