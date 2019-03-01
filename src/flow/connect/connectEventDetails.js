import { connect } from 'react-redux'
import moment from 'moment'

import { setCurrentEvent, unsetCurrentEvent } from '../store/event/eventAction'

import {
  addEvent,
  deleteEvent,
  updateEvent,
  createConferencingRoom,
  removeConferencingRoom,
  setRemindersInfoRequest,
} from '../../flow/store/event/eventActionLazy'

import {
  setInviteStatus,
  unsetCurrentInvites,
} from '../../flow/store/event/contactActionLazy'

const eventDefaults = {
  start: moment(),
  end: moment(),
  allDay: false,
  public: false,
  hexColor: '#265985',
  reminderTime: 10,
  reminderTimeUnit: 'minutes',
  reminderEnabled: true,
}

export default connect(
  (state, redux) => {
    console.log('[ConnectedEventDetails]', state)
    const { GuestList } = state.lazy
    const { currentEvent, currentEventType, calendars } = state.events
    const inviteError = state.events.inviteError
    const inviteSuccess = state.events.inviteSuccess
    const inviteStatus = state.events.inviteStatus
    const addingConferencing = state.events.addingConferencing
    const removingConferencing = state.events.removingConferencing
    const richNotifEnabled = state.events.richNotifEnabled
    const richNofifExclude = state.events.richNofifExclude

    return {
      inviteStatus,
      inviteError,
      inviteSuccess,
      views: { GuestList },
      currentEvent: Object.assign({}, eventDefaults, currentEvent),
      editMode: currentEventType,
      addingConferencing,
      removingConferencing,
      richNotifEnabled,
      richNofifExclude,
      calendars,
    }
  },
  (dispatch, redux) => {
    return {
      unsetCurrentEvent: () => {
        dispatch(unsetCurrentEvent())
      },
      popSendInvitesModal: eventDetails => {
        dispatch(setCurrentEvent(eventDetails))
        dispatch(setInviteStatus('prepare'))
      },
      showRemindersModal: eventDetails => {
        dispatch(setCurrentEvent(eventDetails))
        dispatch(setRemindersInfoRequest())
      },
      updateCurrentEvent: eventDetails => {
        dispatch(setCurrentEvent(eventDetails))
      },
      unsetInviteError: () => {
        dispatch(unsetCurrentInvites())
      },
      deleteEvent: obj => dispatch(deleteEvent(obj)),
      addEvent: obj => {
        dispatch(addEvent(obj))
      },
      updateEvent: obj => dispatch(updateEvent(obj)),
      createConferencingRoom: (eventDetails, guests) => {
        dispatch(createConferencingRoom(eventDetails, guests))
      },
      removeConferencingRoom: obj => dispatch(removeConferencingRoom(obj)),
    }
  }
)
