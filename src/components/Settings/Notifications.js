import React, { Component } from 'react'
import { Form, Card, ProgressBar } from 'react-bootstrap'
import { renderMatrixError } from '../EventDetails'
const guestsStringToArray = function(guestsString) {
  if (!guestsString || !guestsString.length) {
    return []
  }
  const guests = guestsString.split(/[,\s]+/g)
  return guests.filter(g => g.length > 0).map(g => g.toLowerCase())
}

export default class Notifications extends Component {
  constructor(props) {
    super(props)

    const { richNotifEnabled, richNofifExclude } = this.props

    this.state = {
      richNofifExclude: richNofifExclude ? richNofifExclude.join(',') : '',
      richNotifEnabled,
    }
  }
  handleEnrichedNotificationsChange = event => {
    const { enableRichNotif, disableRichNotif } = this.props
    if (event.target.checked) {
      enableRichNotif()
    } else {
      disableRichNotif()
    }
  }

  handleExcludedGuestsChange = event => {
    const { saveRichNotifExcludeGuests } = this.props
    saveRichNotifExcludeGuests(guestsStringToArray(event.target.value))
  }

  renderBody = () => {
    const { richNotifEnabled, richNofifExclude } = this.state
    const { richNotifError, chatStatus } = this.props
    const checkingChatStatus = chatStatus === 'checking'
    const richNotifErrorMsg = richNotifError
      ? renderMatrixError('Rich notifications not allowed.', richNotifError)
      : []
    return (
      <Form>
        <Form.Group controlId="formBasicChecbox">
          <Form.Check
            type="checkbox"
            label="Enable Enriched Notifications"
            defaultChecked={richNotifEnabled}
            onChange={this.handleEnrichedNotificationsChange}
          />
        </Form.Group>
        <Form.Group controlId="formEcludedGuests">
          <Form.Label>Excluded guests</Form.Label>
          <Form.Control
            type="email"
            defaultValue={richNofifExclude}
            placeholder="bob.id, alice.id.blockstack, ..."
            onBlur={this.handleExcludedGuestsChange}
          />
        </Form.Group>
        {checkingChatStatus && (
          <>
            Connecting to OI Chat ..
            <ProgressBar animated now={50} />
          </>
        )}
        {richNotifError && <>{richNotifErrorMsg}</>}
      </Form>
    )
  }

  render() {
    return (
      <Card style={{}}>
        <Card.Header>Enriched Notifications</Card.Header>
        <Card.Body>{this.renderBody()}</Card.Body>
      </Card>
    )
  }
}
