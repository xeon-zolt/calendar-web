import {
  ALL_EVENTS,
  REMOVE_EVENT,
  ADD_EVENT,
  UPDATE_EVENT,
  USER,
  ALL_CONTACTS,
  INVITES_SENT_OK,
  INVITES_SENT_FAIL,
  // ADD_CONTACT,
  // LOAD_GUEST_LIST,
  SET_CURRENT_GUESTS,
  VIEW_EVENT
} from "../ActionTypes";

// :WARN: reducer should have no dependency on io/event
// A reducer should have no side effect other than change the state of
// the store
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
  const { type, payload } = action;
  switch (type) {
    case USER:
      return { ...state, user: action.user };
    case ALL_CONTACTS:
      // console.log('all contacts', payload.contacts);
      return { ...state, contacts: payload.contacts };
    case ALL_EVENTS:
      return { ...state, allEvents: action.allEvents };
    case VIEW_EVENT:
      return {
        ...state,
        currentEvent: payload.eventInfo,
        currentEventType: payload.eventType
      };
    case REMOVE_EVENT:
      let { allEvents } = state;
      allEvents = allEvents.filter(function(obj) {
        return obj && obj.uid !== payload.obj.uid;
      });
      publishEvents(payload.obj.uid, removePublicEvent);
      saveEvents("default", allEvents);
      return { ...state, allEvents };
    case ADD_EVENT:
      allEvents = state.allEvents;
      payload.calendarName = "default";
      payload.uid = uuid();
      allEvents[payload.uid] = payload;
      if (payload.public) {
        publishEvents(payload, addPublicEvent);
      }
      saveEvents("default", allEvents);
      window.history.pushState({}, "OI Calendar", "/");
      delete state.currentEvent;
      delete state.currentEventType;
      return { ...state, allEvents };
    case UPDATE_EVENT:
      allEvents = state.allEvents;
      var eventInfo = payload.obj;
      eventInfo.uid = eventInfo.uid || uuid();
      allEvents[eventInfo.uid] = eventInfo;
      if (eventInfo.public) {
        publishEvents(eventInfo, updatePublicEvent);
      } else {
        publishEvents(eventInfo.uid, removePublicEvent);
      }
      saveEvents("default", allEvents);
      return { ...state, allEvents };
    case INVITES_SENT_OK:
      allEvents = state.allEvents;
      if (payload.type === "add") {
        allEvents[payload.eventInfo.uid] = payload.eventInfo;
        saveEvents("default", allEvents);
      }
      return {
        ...state,
        allEvents,
        inviteSuccess: true,
        inviteError: undefined
      };
    case INVITES_SENT_FAIL:
      return {
        ...state,
        inviteSuccess: false,
        inviteError: payload.error
      };
    case SET_CURRENT_GUESTS:
      return {
        ...state,
        currentGuests: payload.profiles,
        inviteSuccess: undefined,
        inviteError: undefined
      };
    default:
      return state;
  }
}
