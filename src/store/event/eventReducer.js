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
        return obj && obj.id !== action.payload.obj.id;
      });
      publishEvents(action.payload.obj.uid, removePublicEvent);
      saveEvents("default", allEvents);
      return { ...state, allEvents };
    case ADD_EVENT:
      var { allEvents } = state;
      action.payload.calendarName = "default";
      allEvents.push(action.payload);
      if (action.payload.public) {
        publishEvents(action.payload, addPublicEvent);
      }
      saveEvents("default", allEvents);
      return { ...state, allEvents };
    case UPDATE_EVENT:
      var { allEvents } = state;
      var eventInfo = action.payload.obj;
      allEvents[eventInfo.id] = eventInfo;
      if (eventInfo.public) {
        eventInfo.uid = eventInfo.uid || uuid();
        publishEvents(eventInfo, updatePublicEvent);
      } else {
        if (eventInfo.uid) {
          publishEvents(eventInfo.uid, removePublicEvent);
        }
      }
      saveEvents("default", allEvents);
      return { ...state, allEvents };
    case INVITES_SENT:
      var { allEvents } = state;
      if (action.payload.type === "add") {
        allEvents.push(action.payload.eventInfo);
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
