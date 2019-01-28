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
      showInstructions: true,
      showModal: false,
      eventType: "add",
      newIndex: 0,
      eventInfo: {}
    };

    this.bound = [
      "handleHide",
      "handleHideInstructions",
      "handleShow",
      "deleteEvent",
      "addEvent",
      "updateEvent"
    ].reduce((acc, d) => {
      acc[d] = this[d].bind(this);
      return acc;
    }, {});
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

  handleHideInstructions() {
    this.setState({ showInstructions: false });
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
    const { signedIn } = this.props;
    const { showInstructions } = this.state;
    const { handleHide, handleShow, handleHideInstructions } = this.bound;
    console.log("allevents", this.props.events.allEvents);
    return (
      <div className="bodyContainer">
        {/* :Q: would you like anything to appear on the screen after a user opted to hide the instructions? */}
        {showInstructions && (
          <div className="well well-sm">
            {signedIn && (
              <div>
                <div class="modal-header">
                  <button
                    type="button"
                    class="close"
                    onClick={handleHideInstructions}
                  >
                    <span aria-hidden="true">×</span>
                    <span class="sr-only">Close</span>
                  </button>
                  <h4 id="contained-modal-title" class="modal-title">
                    Instructions
                  </h4>
                </div>
                <strong>To add an event: </strong> Click on the day you want to
                add an event or drag up to the day you want to add the event for
                multiple day event! <br />
                <strong>To update and delete an event:</strong> Click on the
                event you wish to update or delete!
              </div>
            )}
            {!signedIn && (
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title">
                  Private, Encrypted Calendar in the Cloud
                </Modal.Title>
                <strong>To learn about Blockstack: </strong> A good starting
                point is{" "}
                <a href="https://docs.blockstack.org">
                  Blockstack's documentation
                </a>
                .<br />
                <strong>I have already a Blockstack ID:</strong> Just sign in
                using the blockstack button above!
              </Modal.Header>
            )}
          </div>
        )}
        <EventDetails
          showModal={this.state.showModal}
          handleHide={handleHide}
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
          onSelectEvent={event => handleShow(event, "edit")}
          onSelectSlot={slotInfo => handleShow(slotInfo, "add")}
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
