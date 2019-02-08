import {
  SET_EVENTS,
  USER,
  SET_CONTACTS,
  INVITES_SENT_OK,
  INVITES_SENT_FAIL,
  SET_CURRENT_GUESTS,
  SET_CURRENT_EVENT,
  UNSET_CURRENT_EVENT,
  INITIALIZE_CHAT,
  SHOW_SETTINGS,
  HIDE_SETTINGS,
  SHOW_SETTINGS_ADD_CALENDAR,
  SET_CALENDARS,
  SHOW_MY_PUBLIC_CALENDAR,
  SHOW_ALL_CALENDARS,
  SET_PUBLIC_CALENDAR_EVENTS,
  SHOW_INSTRUCTIONS,
  AUTH_SIGN_OUT,
  UNSET_CURRENT_INVITES,
  SET_LOADING_CALENDARS,
} from '../ActionTypes'

let initialState = {
  allEvents: [],
  calendars: [],
  contacts: [],
  user: '',
}

export default function reduce(state = initialState, action = {}) {
  // console.log("EventReducer", action);
  const { type, payload } = action
  let newState = state
  switch (type) {
    case INITIALIZE_CHAT:
      newState = { ...state, userSessionChat: payload }
      break

    case USER:
      newState = { ...state, user: action.user }
      break

    case SET_CONTACTS:
      newState = { ...state, contacts: payload }
      break

    case SET_EVENTS:
      newState = { ...state, allEvents: action.allEvents }
      break

    case SET_CURRENT_EVENT:
      console.log('SET_CURRENT_EVENT', payload)
      newState = {
        ...state,
        currentEvent: payload.currentEvent,
        currentEventType: payload.currentEventType,
      }
      break

    case UNSET_CURRENT_EVENT:
      newState = {
        ...state,
        currentEvent: undefined,
        currentEventType: undefined,
        inviteSuccess: undefined,
        inviteError: undefined,
      }
      break

    case INVITES_SENT_OK:
      console.log('INVITES_SENT_OK')
      newState = {
        ...state,
        currentEvent: undefined,
        currentEventType: undefined,
        inviteSuccess: true,
        inviteError: undefined,
      }
      break

    case INVITES_SENT_FAIL:
      console.log('INVITES_SENT_FAIL')
      newState = {
        ...state,
        currentEvent: payload.eventInfo,
        currentEventType: payload.eventType,
        inviteSuccess: false,
        inviteError: payload.error,
      }
      break
    case UNSET_CURRENT_INVITES:
      newState = {
        ...state,
        inviteSuccess: undefined,
        inviteError: undefined,
      }
      break

    case SET_CURRENT_GUESTS:
      newState = {
        ...state,
        currentGuests: payload.profiles,
        inviteSuccess: undefined,
        inviteError: undefined,
      }
      break

    case SHOW_SETTINGS:
      newState = { ...state, showSettings: true }
      break

    case SHOW_SETTINGS_ADD_CALENDAR:
      newState = {
        ...state,
        showSettings: true,
        showSettingsAddCalendarUrl: payload.url,
      }
      break

    case HIDE_SETTINGS:
      newState = { ...state, showSettings: false }
      break
    case SET_CALENDARS:
      newState = { ...state, calendars: payload }
      break
    case SHOW_MY_PUBLIC_CALENDAR:
      newState = {
        ...state,
        myPublicCalendar: payload.name,
        myPublicCalendarIcsUrl: payload.icsUrl,
        publicCalendar: undefined,
        publicCalendarEvents: undefined,
      }
      break
    case SHOW_ALL_CALENDARS:
      newState = {
        ...state,
        myPublicCalendar: undefined,
        myPublicCalendarIcsUrl: undefined,
        publicCalendar: undefined,
        publicCalendarEvents: undefined,
      }
      break
    case SET_PUBLIC_CALENDAR_EVENTS:
      newState = {
        ...state,
        myPublicCalendar: undefined,
        myPublicCalendarIcsUrl: undefined,
        publicCalendarEvents: payload.allEvents,
        publicCalendar: payload.calendar.name,
      }
      break
    case SET_LOADING_CALENDARS:
      const currentIndex = state.currentCalendarIndex || 0
      const currentCalendarIndex =
        payload.index > currentIndex ? payload.index : currentIndex
      const done = payload.index >= payload.length
      newState = {
        ...state,
        currentCalendarIndex: done ? undefined : currentCalendarIndex,
        currentCalendarLength: done ? undefined : payload.length,
      }
      break
    case SHOW_INSTRUCTIONS:
      newState = {
        ...state,
        showInstructions: { general: payload.show },
      }
      break
    case AUTH_SIGN_OUT:
      newState = initialState
      break
    default:
      newState = state
      break
  }

  return newState
}
