import {
  SET_EVENTS,
  USER,
  SET_CONTACTS,
  INVITES_SENT_OK,
  INVITES_SENT_FAIL,
  SET_CURRENT_GUESTS,
  VIEW_EVENT,
  INITIALIZE_CHAT,
  SHOW_SETTINGS,
  HIDE_SETTINGS,
  SET_CALENDARS
} from "../ActionTypes";

let initialState = {
  allEvents: [],
  contacts: {},
  user: ""
};

export default function reduce(state = initialState, action = {}) {
  console.log("EventReducer", action);
  const { type, payload } = action;
  let newState = state;
  switch (type) {
    case INITIALIZE_CHAT:
      newState = { ...state, userSessionChat: payload };
      break;

    case USER:
      newState = { ...state, user: action.user };
      break;

    case SET_CONTACTS:
      newState = { ...state, contacts: payload.contacts };
      break;

    case SET_EVENTS:
      newState = { ...state, allEvents: action.allEvents };
      break;

    case VIEW_EVENT:
      newState = {
        ...state,
        currentEvent: payload.eventInfo,
        currentEventType: payload.eventType
      };
      break;

    case INVITES_SENT_OK:
      newState = {
        ...state,
        allEvents: payload.allEvents,
        inviteSuccess: true,
        inviteError: undefined
      };
      break;

    case INVITES_SENT_FAIL:
      newState = {
        ...state,
        inviteSuccess: false,
        inviteError: payload.error
      };
      break;

    case SET_CURRENT_GUESTS:
      newState = {
        ...state,
        currentGuests: payload.profiles,
        inviteSuccess: undefined,
        inviteError: undefined
      };
      break;

    case SHOW_SETTINGS:
      newState = {
        ...state,
        showSettings: true
      };
      break;

    case HIDE_SETTINGS:
      newState = {
        ...state,
        showSettings: false
      };
      break;
    case SET_CALENDARS:
      newState = {
        ...state,
        calendars: action.payload.calendars
      };
      break;

    default:
      newState = state;
      break;
  }

  return newState;
}
