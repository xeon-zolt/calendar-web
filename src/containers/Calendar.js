import { connect } from 'react-redux'

// Components
import Calendar from '../components/Calendar'

import { setNewCurrentEvent } from '../store/event/eventAction'
import {
  showAllCalendars,
  hideInstructions,
  setError,
  initializeLazyActions,
} from '../store/event/eventActionLazy'

import { showSettingsAddCalendar } from '../store/event/calendarActionLazy'

const mapStateToProps = state => {
  const { events, auth } = state
  const signedIn = !!auth.user

  const {
    currentEvent,
    currentEventType,
    myPublicCalendar,
    myPublicCalendarIcsUrl,
    publicCalendarEvents,
    publicCalendar,
    showInstructions,
    currentCalendarIndex,
    currentCalendarLength,
    currentError,
    showRemindersInfo,
    inviteStatus,
  } = events || {}

  let eventModal
  if (currentEvent && !inviteStatus) {
    const eventType = currentEventType || 'view' // "add", "edit"
    eventModal = { eventType, eventInfo: currentEvent }
  }

  const showGeneralInstructions = showInstructions
    ? showInstructions.general
    : false // preferences not yet loaded

  const showError = currentError && currentError.msg
  const error = currentError ? currentError.msg : null
  const showRemindersModal = showRemindersInfo
  const showSendInvitesModal = !!inviteStatus
  return {
    events,
    signedIn,
    eventModal,
    currentEvent,
    currentEventType,
    myPublicCalendar,
    myPublicCalendarIcsUrl,
    publicCalendarEvents,
    publicCalendar,
    showGeneralInstructions,
    currentCalendarIndex,
    currentCalendarLength,
    showError,
    error,
    showSendInvitesModal,
    showRemindersModal,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initializeLazyActions: () => {
      dispatch(initializeLazyActions())
    },
    showAllCalendars: () => {
      dispatch(showAllCalendars())
    },
    hideInstructions: () => {
      dispatch(hideInstructions())
    },
    showSettingsAddCalendar: url => {
      dispatch(showSettingsAddCalendar(url))
    },
    pickEventModal: eventModal => {
      console.log('[pickEventModal]', eventModal)
      const {
        eventType: currentEventType,
        eventInfo: currentEvent,
      } = eventModal
      dispatch(setNewCurrentEvent(currentEvent, currentEventType))
    },
    markErrorAsRead: () => {
      dispatch(setError())
    },
  }
}

const CalendarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Calendar)

export default CalendarContainer
