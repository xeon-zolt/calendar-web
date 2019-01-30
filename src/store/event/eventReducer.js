import {
  ALL_EVENTS,
  REMOVE_EVENT,
  ADD_EVENT,
  UPDATE_EVENT,
  USER,
  ALL_CONTACTS,
  INVITES_SENT,
  SEND_INVITES_FAILED,
  // ADD_CONTACT,
  // LOAD_GUEST_LIST,
  CURRENT_GUESTS,
  VIEW_EVENT
} from "../ActionTypes";

import {
  publishEvents,
  saveEvents,
  updatePublicEvent,
  removePublicEvent,
  addPublicEvent,
  createSessionChat
} from "../../io/event";
import { uuid } from "../../io/eventFN";

let initialState = {
  allEvents: [],
  userSessionChat: createSessionChat(),
  contacts: {},
  user: ""
};

export default function reduce(state = initialState, action = {}) {
  console.log("EventReducer", action);
  switch (action.type) {
    case USER:
      return { ...state, user: action.user };
    case ALL_CONTACTS:
      // console.log('all contacts', action.payload.contacts);
      return { ...state, contacts: action.payload.contacts };
    case ALL_EVENTS:
      return { ...state, allEvents: action.allEvents };
    case VIEW_EVENT:
      return { ...state, currentEvent: action.payload.eventInfo };
    case REMOVE_EVENT:
      let { allEvents } = state;
      allEvents = allEvents.filter(function(obj) {
        return obj && obj.uid !== action.payload.obj.uid;
      });
      publishEvents(action.payload.obj.uid, removePublicEvent);
      saveEvents("default", allEvents);
      return { ...state, allEvents };
    case ADD_EVENT:
      allEvents = state.allEvents;
      action.payload.calendarName = "default";
      action.payload.uid = uuid();
      allEvents[action.payload.uid] = action.payload;
      if (action.payload.public) {
        publishEvents(action.payload, addPublicEvent);
      }
      saveEvents("default", allEvents);
      return { ...state, allEvents };
    case UPDATE_EVENT:
      allEvents = state.allEvents;
      var eventInfo = action.payload.obj;
      eventInfo.uid = eventInfo.uid || uuid();
      allEvents[eventInfo.uid] = eventInfo;
      if (eventInfo.public) {
        publishEvents(eventInfo, updatePublicEvent);
      } else {
        publishEvents(eventInfo.uid, removePublicEvent);
      }
      saveEvents("default", allEvents);
      return { ...state, allEvents };
    case INVITES_SENT:
      allEvents = state.allEvents;
      if (action.payload.type === "add") {
        allEvents[action.payload.eventInfo.uid] = action.payload.eventInfo;
        saveEvents("default", allEvents);
      }
      return {
        ...state,
        allEvents,
        inviteSuccess: true,
        inviteError: undefined
      };
    case SEND_INVITES_FAILED:
      return {
        ...state,
        inviteSuccess: false,
        inviteError: action.payload.error
      };
    case CURRENT_GUESTS:
      return {
        ...state,
        currentGuests: action.payload.profiles,
        inviteSuccess: undefined,
        inviteError: undefined
      };
    default:
      return state;
  }
}
