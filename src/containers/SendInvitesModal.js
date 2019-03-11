import { connect } from 'react-redux'

import { setCurrentEvent } from '../store/event/eventAction'

import { saveAllEvents } from '../store/event/eventActionLazy'
import SendInvitesModal from '../components/Calendar/SendInvitesModal'
import {
  setInviteStatus,
  sendInvites,
  unsetCurrentInvites,
  loadGuestList,
} from '../store/event/contactActionLazy'

export default connect(
  state => {
    console.log('[ConnectedSendInvitesModal]', state)
    const { currentEvent, currentEventType, currentGuests } = state.events
    const inviteError = state.events.inviteError
    const inviteSuccess = state.events.inviteSuccess
    const inviteStatus = state.events.inviteStatus
    const sending = inviteStatus === 'started'

    return {
      inviteStatus,
      inviteError,
      inviteSuccess,
      currentEvent,
      currentEventType,
      guests: currentEvent.guests,
      title: currentEvent.title,
      sending,
      profiles: currentGuests,
    }
  },
  dispatch => {
    return {
      handleInvitesHide: (inviteError, eventDetails) => {
        dispatch(setInviteStatus(undefined))
        dispatch(unsetCurrentInvites())
        eventDetails.noInvites = !inviteError
        dispatch(setCurrentEvent(eventDetails))
      },
      loadGuestList: guests => {
        dispatch(loadGuestList(guests))
      },
      sendInvites: (eventDetails, guests, editMode) => {
        dispatch(setInviteStatus('started'))
        dispatch(sendInvites(eventDetails, guests)).then(allEvents => {
          if (editMode === 'add' || editMode === 'edit') {
            allEvents[eventDetails.uid] = eventDetails
          }
          dispatch(saveAllEvents(allEvents))
        })
      },
    }
  }
)(SendInvitesModal)
