import { Button, Modal, ProgressBar } from 'react-bootstrap'
import React from 'react'
import PropTypes from 'prop-types'
import { renderMatrixError } from '../EventDetails'

class SendInvitesModal extends React.Component {
  constructor(props) {
    super(props)
    console.log('SendInvitesModal')
    this.state = { profiles: undefined }
  }

  componentDidMount() {
    var { guests, profiles } = this.props
    console.log('didMount', { guests, profiles })
    if (!profiles) {
      if (typeof guests !== 'string') {
        guests = ''
      }
      const guestList = guests.toLowerCase().split(/[,\s]+/g)
      console.log('dispatch load guest list', guestList)
      this.props.loadGuestList(guestList)
    }
  }

  componentWillReceiveProps(nextProps) {
    var { guests, profiles, loadGuestList } = nextProps
    console.log('componentWillReceiveProps', { guests, profiles })

    if (!profiles) {
      if (typeof guests !== 'string') {
        guests = ''
      }
      const guestList = guests.toLowerCase().split(/[,\s]+/g)
      console.log('dispatch load guest list', guestList)
      loadGuestList(guestList)
    }
  }

  render() {
    const {
      title,
      handleInvitesHide,
      sending,
      inviteError,
      sendInvites,
      GuestList,
      profiles,
      currentEvent,
      currentEventType,
    } = this.props
    console.log('profiles', profiles)
    let inviteErrorMsg = []
    if (inviteError) {
      inviteErrorMsg = renderMatrixError(
        'Sending invites not possible.',
        inviteError
      )
    }
    return (
      <Modal
        show
        onHide={() => handleInvitesHide(undefined, currentEvent, currentEvent)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Send invites according to their Blockstack settings:
          {GuestList && <GuestList guests={profiles} />}
          {sending && !inviteError && <ProgressBar animated now={50} />}
          {inviteError && inviteErrorMsg}
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() =>
                sendInvites(currentEvent, profiles, currentEventType)
              }
            >
              Send
            </Button>
            <Button
              onClick={() =>
                handleInvitesHide(inviteError, currentEvent, currentEventType)
              }
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    )
  }
}

SendInvitesModal.propTypes = {
  guests: PropTypes.string,
  profiles: PropTypes.object,
  handleInvitesHide: PropTypes.func,
  inviteError: PropTypes.instanceOf(Error),
  loadGuestList: PropTypes.func,
  sending: PropTypes.bool,
  sendInvites: PropTypes.func,
  title: PropTypes.string,
}

export default SendInvitesModal
