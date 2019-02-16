import React, { Component } from 'react'
import moment from 'moment'
import {
  Card,
  Container,
  Row,
  Col,
  ProgressBar,
  Button,
  Alert,
} from 'react-bootstrap'
import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { uuid } from '../../flow/io/eventFN'

let localizer = BigCalendar.momentLocalizer(moment)
let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

class EventCalendar extends Component {
  constructor(props) {
    super(props)
    this.bound = [
      'handleHideInstructions',
      'handleAddEvent',
      'handleEditEvent',
      'handleViewAllCalendars',
      'handleAddCalendarByUrl',
    ].reduce((acc, d) => {
      acc[d] = this[d].bind(this)
      return acc
    }, {})
  }

  componentWillMount() {
    this.props.initializeLazyActions()
  }

  handleHideInstructions() {
    this.props.hideInstructions()
  }

  handleViewAllCalendars() {
    this.props.showAllCalendars()
  }

  handleEditEvent(event) {
    const { pickEventModal } = this.props
    var eventType
    if (event.mode === 'read-only') {
      eventType = 'view'
    } else {
      eventType = 'edit'
    }
    pickEventModal({
      eventType,
      eventInfo: event,
    })
  }

  handleAddEvent(slotInfo) {
    const { pickEventModal } = this.props
    slotInfo.uid = uuid()
    pickEventModal({
      eventType: 'add',
      eventInfo: slotInfo,
    })
  }

  handleAddCalendarByUrl(event) {
    if (event.key === 'Enter') {
      const { showSettingsAddCalendar } = this.props
      showSettingsAddCalendar(event.target.value)
    }
  }

  eventStyle(event, start, end, isSelected) {
    var bgColor = event && event.hexColor ? event.hexColor : '#265985'
    var style = {
      backgroundColor: bgColor,
      borderColor: 'white',
    }
    return {
      style: style,
    }
  }

  getEventStart(eventInfo) {
    return eventInfo ? new Date(eventInfo.start) : new Date()
  }

  getEventEnd(eventInfo) {
    return eventInfo && (eventInfo.end || eventInfo.calculatedEndTime)
      ? eventInfo.end
        ? new Date(eventInfo.end)
        : new Date(eventInfo.calculatedEndTime)
      : new Date()
  }

  render() {
    console.log('[EventCalendar.render]', this.props)
    const {
      signedIn,
      views,
      myPublicCalendar,
      myPublicCalendarIcsUrl,
      publicCalendar,
      publicCalendarEvents,
      showGeneralInstructions,
      eventModal,
      inviteSuccess,
      currentCalendarLength,
      currentCalendarIndex,
      showError,
      error,
      showSettingsAddCalendar,
      markErrorAsRead,
    } = this.props
    const { EventDetails } = views
    const {
      handleHideInstructions,
      handleEditEvent,
      handleAddEvent,
      handleViewAllCalendars,
      handleAddCalendarByUrl,
    } = this.bound

    let events = Object.values(this.props.events.allEvents)
    let shareUrl = null
    if (myPublicCalendar) {
      events = events.filter(e => e.public && e.calendarName === 'default')
      shareUrl =
        window.location.origin + '/?intent=view&name=' + myPublicCalendar
    } else if (publicCalendarEvents) {
      events = publicCalendarEvents
      shareUrl =
        window.location.origin + '/?intent=addics&url=' + publicCalendar
    }

    const calendarView = (
      <div>
        <div style={{ height: 8 }}>
          {currentCalendarLength && (
            <ProgressBar
              style={{ height: 8 }}
              now={currentCalendarIndex + 1}
              max={currentCalendarLength}
            />
          )}
        </div>
        <BigCalendar
          localizer={localizer}
          selectable={
            this.props.signedIn && !myPublicCalendar && !publicCalendar
          }
          events={events}
          views={allViews}
          step={60}
          showMultiDayTimes
          defaultDate={new Date(moment())}
          onSelectEvent={event => handleEditEvent(event)}
          onSelectSlot={slotInfo => handleAddEvent(slotInfo)}
          style={{ minHeight: '500px' }}
          eventPropGetter={this.eventStyle}
          startAccessor={this.getEventStart}
          endAccessor={this.getEventEnd}
        />
        {showError && (
          <div
            style={{
              position: 'fixed',
              bottom: '10px',
              right: '10px',
              zIndex: '10',
            }}
          >
            <Alert variant="danger" dismissible>
              {error}
              <p>
                <Button onClick={() => showSettingsAddCalendar()}>
                  Go to settings
                </Button>
                <span> or </span>
                <Button onClick={markErrorAsRead}>Hide this message</Button>
              </p>
            </Alert>
          </div>
        )}
      </div>
    )

    return (
      <div className="bodyContainer">
        {signedIn &&
          showGeneralInstructions &&
          !myPublicCalendar &&
          !publicCalendar && (
            <Card>
              <Card.Header>
                Instructions
                <button
                  type="button"
                  className="close"
                  onClick={handleHideInstructions}
                >
                  <span aria-hidden="true">×</span>
                  <span className="sr-only">Close</span>
                </button>
              </Card.Header>
              <Card.Body>
                <Container style={{ width: '100%' }}>
                  <div style={{ padding: '20px' }}>
                    <Row style={{ textAlign: 'left' }}>
                      <Col md={6}>
                        <strong>To add an event: </strong> Click or long-press
                        on the day you want to add an event or drag up to the
                        day you want to add the event for multiple day event!{' '}
                        <br />
                      </Col>
                      <Col md={6}>
                        <strong>To update and delete an event:</strong> Click on
                        the event you wish to update or delete!
                      </Col>
                    </Row>
                    <Row style={{ padding: '20px' }}>
                      <Col xs={12} sm={2} style={{ textAlign: 'center' }}>
                        <img
                          src="/images/gcalendar.png"
                          width="48px"
                          height="48px"
                          alt="Google Calendar"
                        />
                      </Col>
                      <Col xs={12} sm={10} style={{ textAlign: 'left' }}>
                        <strong>Move from Google Calendar</strong>: Done in a
                        minute! Follow the{' '}
                        <a href="https://github.com/friedger/oi-calendar">
                          2-step tutorial
                        </a>
                        .
                        <br />
                        <input
                          style={{ width: '100%' }}
                          type="text"
                          placeholder="Paste url like https://calendar.google..../basic.ics"
                          onKeyPress={handleAddCalendarByUrl}
                        />
                      </Col>
                    </Row>
                  </div>
                </Container>
              </Card.Body>
            </Card>
          )}
        {!signedIn && (
          <Card>
            <Card.Header>Private, Encrypted Calendar in the Cloud</Card.Header>
            <Card.Body>
              <div className="col-md-5">
                <strong>I have already a Blockstack ID:</strong> Just sign in
                using the blockstack button above!
              </div>
              <div className="col-md-2" style={{ padding: '10px' }}>
                <img
                  src="blockstack.png"
                  alt=""
                  height="30"
                  style={{ verticalAlign: 'middle' }}
                />
              </div>
              <div className="col-md-5">
                <strong>To learn about Blockstack: </strong> A good starting
                point is{' '}
                <a href="https://docs.blockstack.org">
                  Blockstack's documentation
                </a>
                .<br />
              </div>
            </Card.Body>
          </Card>
        )}
        {eventModal && !inviteSuccess && <EventDetails />}
        {(myPublicCalendar || publicCalendar) && (
          <Card>
            <Card.Header>
              Public Calendar {myPublicCalendar}
              {publicCalendar}
              <button
                type="button"
                className="close"
                onClick={handleViewAllCalendars}
              >
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>
            </Card.Header>
            {myPublicCalendar && events.length > 0 && (
              <Card.Body>
                Share this url: <a href={shareUrl}>{shareUrl}</a>
                {myPublicCalendarIcsUrl && (
                  <span>
                    {' '}
                    or <a href={myPublicCalendarIcsUrl}> as .ics file</a>
                  </span>
                )}
              </Card.Body>
            )}
            {myPublicCalendar && events.length === 0 && (
              <Card.Body>
                No public events yet. Start publishing your events!
              </Card.Body>
            )}
            {publicCalendar && events.length > 0 && signedIn && (
              <Card.Body>
                <a href={shareUrl}>Add to my calandars</a>
              </Card.Body>
            )}
            <Card.Body>{calendarView}</Card.Body>
          </Card>
        )}
        {!myPublicCalendar && !publicCalendar && calendarView}
      </div>
    )
  }
}

export default EventCalendar
