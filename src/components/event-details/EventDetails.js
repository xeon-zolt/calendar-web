import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import moment from 'moment'

import SendInvitesModal from './SendInvitesModal'

// Styles
import '../../css/datetime.css'
import '../../css/EventDetails.css'

const Datetime = require('react-datetime')

const guestsStringToArray = function(guestsString) {
  if (!guestsString || !guestsString.length) {
    return []
  }
  const guests = guestsString.split(/[,\s]+/g)
  return guests.filter(g => g.length > 0).map(g => g.toLowerCase())
}

function checkHasGuests(str) {
  if (!str || !str.length) {
    return false
  }
  const guests = str.split(/[,\s]+/g)
  return guests.filter(g => g.length > 0).length > 0
}

class EventDetails extends Component {
  constructor(props) {
    super(props)

    const { inviteError, inviteSuccess, showModal } = props

    this.state = {
      showModal,
      showInvitesModal: (!!inviteSuccess && !inviteSuccess) || !!inviteError,
      sending: false,
    }

    this.bound = [
      'handleDataChange',
      'handleInvitesHide',
      'handleClose',
      'popInvitesModal',
      'sendInvites',
      'addEvent',
      'updateEvent',
      'deleteEvent',
    ].reduce((acc, d) => {
      acc[d] = this[d].bind(this)
      delete this[d]
      return acc
    }, {})
  }

  componentWillReceiveProps(nextProps) {
    const { showInvitesModal, sending } = this.state
    console.log('nextProp', nextProps)
    const notProcessedYet =
      (!!this.props.inviteSuccess && !this.props.inviteSuccess) ||
      !!this.props.inviteError
    this.setState({
      showInvitesModal: showInvitesModal && notProcessedYet,
      sending: sending && notProcessedYet,
    })
  }

  handleClose() {
    console.log('HANDLE_CLOSE')
    const { unsetCurrentEvent } = this.props
    unsetCurrentEvent()
  }

  handleDataChange(e, ref) {
    var { eventDetail } = this.props
    var val = ''
    if (ref !== 'allDay' && ref !== 'public') {
      if (ref === 'start' || ref === 'end') {
        val = new Date(moment(e))
      } else {
        val = e.target.value
      }
    } else {
      val = e.target.checked
    }

    eventDetail[ref] = val
    this.setState({ eventDetail })
  }

  addEvent() {
    const { addEvent, eventDetail } = this.props
    const { popInvitesModal, handleClose } = this.bound
    const { guests, noInvites } = eventDetail
    console.log('add event', eventDetail, checkHasGuests(guests))
    if (noInvites || !checkHasGuests(guests)) {
      addEvent(eventDetail)
      handleClose()
    } else {
      popInvitesModal(eventDetail)
    }
  }

  hasGuests(guestsString) {
    return guestsStringToArray(guestsString).length > 0
  }

  deleteEvent(obj) {
    console.log('deleteEvent')
    const { handleClose } = this.bound
    const { deleteEvent } = this.props
    deleteEvent(obj)
    handleClose()
  }

  updateEvent(eventDetail) {
    console.log('[updateEvent]', eventDetail)
    const { handleClose } = this.bound
    const { updateEvent } = this.props
    updateEvent(eventDetail)
    handleClose()
  }

  popInvitesModal(eventDetail) {
    const { loadGuestList } = this.props
    this.setState({ showInvitesModal: true })
    const guestsString = eventDetail.guests
    const guests = guestsStringToArray(guestsString)
    loadGuestList(guests, ({ profiles, contacts }) => {
      this.setState({ guests: profiles })
    })
  }

  handleInvitesHide() {
    const { eventDetail, inviteError, unsetInviteError } = this.props
    this.setState({ showInvitesModal: false })
    unsetInviteError()
    eventDetail.noInvites = !inviteError
  }

  sendInvites() {
    const { sendInvites, eventType, eventDetail } = this.props
    const { guests } = this.state
    this.setState({ sending: true })
    sendInvites(eventDetail, guests, eventType)
  }

  render() {
    console.log('[EVENDETAILS.render]', this.props)

    const { showInvitesModal, sending } = this.state
    const { handleClose } = this.bound
    const {
      views,
      inviteError,
      eventType,
      eventDetail,
      loadGuestList,
    } = this.props
    const { GuestList } = views
    const {
      handleDataChange,
      handleInvitesHide,
      popInvitesModal,
      sendInvites,
      addEvent,
      updateEvent,
      deleteEvent,
    } = this.bound
    const hasGuests = checkHasGuests(eventDetail.guests)

    let inviteErrorMsg = []
    if (inviteError) {
      const error = inviteError
      if (error.errcode === 'M_CONSENT_NOT_GIVEN') {
        var linkUrl = error.consent_uri
        inviteErrorMsg = (
          <div>
            Sending not possible. Please review and accept{' '}
            <a target="_blank" rel="noopener noreferrer" href={linkUrl}>
              the T&amp;C of your chat provider
            </a>{' '}
            openintents.modular.im (OI Chat)
          </div>
        )
      }
    }

    return (
      <Modal show onHide={handleClose}>
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
            value={eventDetail.title || ''}
            onChange={e => handleDataChange(e, 'title')}
          />

          <div className="date-time-container">
            <div className="date-time-group">
              <label> Start Date </label>
              {eventDetail.allDay ? (
                <Datetime
                  value={eventDetail.start}
                  dateFormat="MM-DD-YYYY"
                  timeFormat={false}
                  onChange={e => handleDataChange(e, 'start')}
                />
              ) : (
                <Datetime
                  value={eventDetail.start}
                  onChange={e => handleDataChange(e, 'start')}
                />
              )}
            </div>

            <div className="date-time-group">
              <label> End Date </label>
              {eventDetail.allDay ? (
                <Datetime
                  value={eventDetail.end}
                  dateFormat="MM-DD-YYYY"
                  timeFormat={false}
                  onChange={e => handleDataChange(e, 'end')}
                />
              ) : (
                <Datetime
                  value={eventDetail.end}
                  onChange={e => handleDataChange(e, 'end')}
                />
              )}
            </div>
          </div>

          <div className="reminder-container">
            <label> Set Reminder </label>

            <div className="reminder-group">
              <input
                type="number"
                className="form-control"
                placeholder="10"
                ref="reminderTime"
                value={eventDetail.reminderTime || ''}
                onChange={e => handleDataChange(e, 'reminderTime')}
              />

              <select
                value={eventDetail.reminderTimeUnit || 'ss'}
                onChange={e => handleDataChange(e, 'reminderTimeUnit')}
              >
                <option value="ss">Seconds</option>
                <option value="mm">Minutes</option>
                <option value="hh">Hours</option>
              </select>
            </div>
          </div>

          <label> Event Notes </label>
          <textarea
            className="form-control"
            placeholder="Event Notes"
            ref="notes"
            value={eventDetail.notes || ''}
            onChange={e => handleDataChange(e, 'notes')}
          />

          <label> Guests (experimental)</label>
          <textarea
            className="form-control"
            placeholder="bob.id, alice.id.blockstack,.."
            ref="guests"
            value={eventDetail.guests || ''}
            onChange={e => handleDataChange(e, 'guests')}
          />

          <label> Event Color </label>
          <input
            type="color"
            value={eventDetail.hexColor || ''}
            onChange={e => handleDataChange(e, 'hexColor')}
            style={{ marginRight: '20px', marginLeft: '5px' }}
          />

          <input
            type="checkBox"
            name="all_Day"
            value={eventDetail.allDay}
            checked={eventDetail.allDay}
            onChange={e => handleDataChange(e, 'allDay')}
          />
          <label> All Day </label>
          <input
            type="checkBox"
            name="public"
            value={eventDetail.public}
            checked={eventDetail.public}
            onChange={e => handleDataChange(e, 'public')}
          />
          <label> Public </label>
        </Modal.Body>
        <Modal.Footer>
          {eventType === 'add' && (
            <Button bsStyle="success" onClick={addEvent}>
              Add
            </Button>
          )}
          {eventType === 'edit' && (
            <React.Fragment>
              <Button
                bsStyle="warning"
                disabled={!hasGuests}
                onClick={() => popInvitesModal(eventDetail)}
              >
                Send Invites
              </Button>
              <Button
                bsStyle="warning"
                onClick={() => updateEvent(eventDetail)}
              >
                Update
              </Button>
              <Button bsStyle="danger" onClick={() => deleteEvent(eventDetail)}>
                Delete
              </Button>
            </React.Fragment>
          )}
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>

        {showInvitesModal && (
          <SendInvitesModal
            guests={eventDetail.guests}
            title={eventDetail.title}
            showInvitesModal={showInvitesModal}
            handleInvitesHide={handleInvitesHide}
            sending={sending}
            inviteError={inviteError}
            inviteErrorMsg={inviteErrorMsg}
            GuestList={GuestList}
            sendInvites={sendInvites}
            loadGuestList={loadGuestList}
          />
        )}
      </Modal>
    )
  }
}

EventDetails.propTypes = {
  inviteError: PropTypes.object,
  inviteSuccess: PropTypes.bool,
  showModal: PropTypes.bool,
}

export default EventDetails
