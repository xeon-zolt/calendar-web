import { connect } from 'react-redux'

// Components
import Calendar from '../components/Calendar'

import { setCurrentEvent } from '../store/event/eventAction'
import {
  showAllCalendars,
  hideInstructions,
  setError,
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
  } = events || {}

  let eventModal
  if (currentEvent) {
    const eventType = currentEventType || 'view' // "add", "edit"
    eventModal = { eventType, eventInfo: currentEvent }
  }

  const showGeneralInstructions = showInstructions
    ? showInstructions.general
    : true

  let showError = currentError && currentError.msg
  let error = currentError ? currentError.msg : null

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
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initializeLazyActions: () => {},
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
      dispatch(setCurrentEvent(currentEvent, currentEventType))
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
