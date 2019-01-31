import React, { Component } from "react";
import moment from "moment";
import { Panel, Grid, Row, Col } from "react-bootstrap";
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { uuid } from "../../io/eventFN";
let localizer = BigCalendar.momentLocalizer(moment);
let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class EventCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInstructions: true,
      eventModal: undefined
    };

    this.bound = [
      "handleHide",
      "handleHideInstructions",
      "handleAddEvent",
      "handleEditEvent",
      "handleViewAllCalendars"
    ].reduce((acc, d) => {
      acc[d] = this[d].bind(this);
      return acc;
    }, {});
  }

  componentWillMount() {
    this.props.initializeEvents();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inviteSuccess) {
      this.setState({ eventModal: undefined });
    }
    if (nextProps.currentEvent) {
      const eventType = nextProps.currentEventType || "view";
      const eventInfo = nextProps.currentEvent;
      this.setState({
        eventModal: { eventType, eventInfo }
      });
    }
  }
  handleHide() {
    this.setState({ eventModal: undefined });
  }

  handleHideInstructions() {
    this.setState({ showInstructions: false });
  }
  handleViewAllCalendars() {
    this.props.showAllCalendars();
  }
  handleEditEvent(event) {
    console.log("handleEditEvent", event);
    this.setState({
      eventModal: {
        eventType: event.mode || "edit",
        eventInfo: event
      }
    });
  }

  handleAddEvent(slotInfo) {
    console.log("handleAddEvent");
    slotInfo.uid = uuid();
    this.setState({
      eventModal: {
        eventType: "add",
        eventInfo: slotInfo
      }
    });
  }

  eventStyle(event, start, end, isSelected) {
    var bgColor = event && event.hexColor ? event.hexColor : "#265985";
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
    return eventInfo ? new Date(eventInfo.start) : new Date();
  }

  getEventEnd(eventInfo) {
    return eventInfo ? new Date(eventInfo.end) : new Date();
  }

  render() {
    const {
      signedIn,
      views,
      myPublicCalendar,
      publicCalendar,
      publicCalendarEvents
    } = this.props;
    console.log("propsss", this.props);
    const { showInstructions } = this.state;
    const { EventDetails } = views;
    const {
      handleHide,
      handleHideInstructions,
      handleEditEvent,
      handleAddEvent,
      handleViewAllCalendars: handleShowAllCalendars
    } = this.bound;
    let events = Object.values(this.props.events.allEvents);
    let shareUrl = null;
    if (myPublicCalendar) {
      events = events.filter(
        e => e.public && e.calendarName === myPublicCalendar
      );
      shareUrl =
        window.location.origin + "/?intent=view&name=" + myPublicCalendar;
    } else if (publicCalendarEvents) {
      events = publicCalendarEvents;
      shareUrl =
        window.location.origin + "/?intent=view&name=" + publicCalendar;
    }
    const calendarView = (
      <BigCalendar
        localizer={localizer}
        selectable={this.props.signedIn && !myPublicCalendar && !publicCalendar}
        events={events}
        views={allViews}
        step={60}
        showMultiDayTimes
        defaultDate={new Date(moment())}
        onSelectEvent={event => handleEditEvent(event)}
        onSelectSlot={slotInfo => handleAddEvent(slotInfo)}
        style={{ minHeight: "500px" }}
        eventPropGetter={this.eventStyle}
        startAccessor={this.getEventStart}
        endAccessor={this.getEventEnd}
      />
    );
    return (
      <div className="bodyContainer">
        {/* :Q: would you like anything to appear on the screen after a user opted to hide the instructions?
        :A: No*/}
        {signedIn && showInstructions && !myPublicCalendar && !publicCalendar && (
          <Panel>
            <Panel.Heading>
              Instructions
              <button
                type="button"
                className="close"
                onClick={handleHideInstructions}
              >
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>
            </Panel.Heading>
            <Panel.Body>
              <Grid style={{ width: "100%" }}>
                <Row style={{ textAlign: "left" }}>
                  <Col md={6}>
                    <strong>To add an event: </strong> Click or long-press on
                    the day you want to add an event or drag up to the day you
                    want to add the event for multiple day event! <br />
                  </Col>
                  <Col md={6}>
                    <strong>To update and delete an event:</strong> Click on the
                    event you wish to update or delete!
                  </Col>
                </Row>
                <Row style={{ textAlign: "left" }}>
                  <Col md={2}>
                    <img
                      src="/images/gcalendar.png"
                      width="48px"
                      alt="Google Calendar"
                    />
                  </Col>
                  <Col md={10}>
                    <strong>Move from Google Calendar</strong>: Done in a
                    minutes! Follow the <a href="/move">2-steps tutorial</a>.
                    <br />
                    <input
                      style={{ width: "100%" }}
                      type="text"
                      placeholder="https://calendar.google..../basic.ics"
                    />
                  </Col>
                </Row>
              </Grid>
            </Panel.Body>
          </Panel>
        )}
        {!signedIn && (
          <Panel>
            <Panel.Heading>
              Private, Encrypted Calendar in the Cloud
            </Panel.Heading>
            <Panel.Body>
              <strong>To learn about Blockstack: </strong> A good starting point
              is{" "}
              <a href="https://docs.blockstack.org">
                Blockstack's documentation
              </a>
              .<br />
              <strong>I have already a Blockstack ID:</strong> Just sign in
              using the blockstack button above!
            </Panel.Body>
          </Panel>
        )}
        {this.state.eventModal && (
          <EventDetails handleHide={handleHide} {...this.state.eventModal} />
        )}
        {(myPublicCalendar || publicCalendar) && (
          <Panel>
            <Panel.Heading>
              Public Calendar {myPublicCalendar}
              {publicCalendar}
              <button
                type="button"
                className="close"
                onClick={handleShowAllCalendars}
              >
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>
            </Panel.Heading>
            {events.length > 0 && (
              <Panel.Body>
                Share this url: <a href={shareUrl}>{shareUrl}</a>
              </Panel.Body>
            )}
            {events.length == 0 && (
              <Panel.Body>
                No public events yet. Start publishing your events!
              </Panel.Body>
            )}
            <Panel.Body>{calendarView}</Panel.Body>
          </Panel>
        )}
        {!myPublicCalendar && !publicCalendar && calendarView}
      </div>
    );
  }
}

export default EventCalendar;
