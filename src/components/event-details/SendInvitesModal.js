import { Button, Modal, ProgressBar } from 'react-bootstrap'
import React from 'react'
import PropTypes from 'prop-types'

class SendInvitesModal extends React.Component {
  constructor(props) {
    super(props)
    console.log('SendInvitesModal')
    this.state = { sending: true, profiles: undefined }

    var { guests } = props
    if (typeof guests !== 'string') {
      guests = ''
    }

    const guestList = guests.toLowerCase().split(/[,\s]+/g)
    console.log('dispatch load guest list', guestList)

    props.loadGuestList(guestList, ({ profiles, contacts }) => {
      console.log('profiles', profiles)
      this.setState({ profiles })
    })
  }

  render() {
    const {
      title,
      handleInvitesHide,
      sending,
      inviteError,
      inviteErrorMsg,
      sendInvites,
      GuestList,
    } = this.props

    const { profiles } = this.state
    return (
      <Modal show onHide={handleInvitesHide}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Send invites according to their Blockstack settings:
          {GuestList && <GuestList guests={profiles} />}
          {sending && !inviteError && <ProgressBar active now={50} />}
          {inviteError && inviteErrorMsg}
          <Modal.Footer>
            <Button bsStyle="success" onClick={() => sendInvites(profiles)}>
              Send
            </Button>
            <Button onClick={handleInvitesHide}>Close</Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    )
  }
}

SendInvitesModal.propTypes = {
  guests: PropTypes.object,
  handleInvitesHide: PropTypes.func,
  inviteError: PropTypes.object,
  inviteErrorMsg: PropTypes.string,
  loadGuestList: PropTypes.func,
  sending: PropTypes.bool,
  sendInvites: PropTypes.func,
  title: PropTypes.string,
}

export default SendInvitesModal
