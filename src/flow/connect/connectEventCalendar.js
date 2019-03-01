import { connect } from 'react-redux'

import { setNewCurrentEvent } from '../store/event/eventAction'
import {
  showAllCalendars,
  hideInstructions,
  setError,
} from '../store/event/eventActionLazy'

import { showSettingsAddCalendar } from '../store/event/calendarActionLazy'

export default connect(
  (state, redux) => {
    const { events, auth } = state
    const { EventDetails, SendInvitesModal, RemindersModal } = state.lazy
    const signedIn = !!auth.user
    console.log('[CALENDAR_REDUX]', events)
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
      const eventInfo = currentEvent
      eventModal = { eventType, eventInfo }
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
      views: {
        EventDetails,
        SendInvitesModal,
        RemindersModal,
      },
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
  },
  dispatch => {
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
        dispatch(setNewCurrentEvent(currentEvent, currentEventType))
      },
      markErrorAsRead: () => {
        dispatch(setError())
      },
    }
  }
)
