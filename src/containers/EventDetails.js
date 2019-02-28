import { connect } from 'react-redux'
import moment from 'moment'

// Components
import EventDetails from '../components/EventDetails'

// Actions
import { setCurrentEvent, unsetCurrentEvent } from '../store/event/eventAction'
import {
  addEvent,
  deleteEvent,
  updateEvent,
  saveAllEvents,
  createConferencingRoom,
  removeConferencingRoom,
} from '../store/event/eventActionLazy'
import {
  sendInvites,
  unsetCurrentInvites,
  loadGuestList,
} from '../store/event/contactActionLazy'

const eventDefaults = {
  start: moment(),
  end: moment(),
  allDay: false,
  hexColor: '#265985',
  reminderTime: 10,
  reminderTimeUnit: 'minutes',
  reminderEnabled: true,
}

const mapStateToProps = state => {
  console.log('[ConnectedEventDetails]', state)
  const { currentEvent, currentEventType } = state.events
  const inviteError = state.events.inviteError
  const inviteSuccess = state.events.inviteSuccess
  const addingConferencing = state.events.addingConferencing
  const removingConferencing = state.events.removingConferencing
  const richNotifEnabled = state.events.richNotifEnabled
  const richNofifExclude = state.events.richNofifExclude

  return {
    inviteError,
    inviteSuccess,
    currentEvent: Object.assign({}, eventDefaults, currentEvent),
    editMode: currentEventType,
    addingConferencing,
    removingConferencing,
    richNotifEnabled,
    richNofifExclude,
  }
}

const mapDispatchToProps = (dispatch, redux) => {
  return {
    unsetCurrentEvent: () => {
      dispatch(unsetCurrentEvent())
    },
    loadGuestList: (guests, asyncReturn) => {
      const contacts = redux.store.getState().events.contacts
      loadGuestList(guests, contacts, asyncReturn)
    },
    updateCurrentEvent: eventDetails => {
      dispatch(setCurrentEvent(eventDetails))
    },
    sendInvites: (eventInfo, guests, actionType) =>
      dispatch(sendInvites(eventInfo, guests)).then(() => {
        let { allEvents } = redux.store.getState().events
        if (actionType === 'add' || actionType === 'edit') {
          allEvents[eventInfo.uid] = eventInfo
        }
        dispatch(saveAllEvents(allEvents))
      }),
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

const EventDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventDetails)

export default EventDetailsContainer
