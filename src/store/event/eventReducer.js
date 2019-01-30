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
  uuid,
  createSessionChat
} from "./eventAction";
import { putFile } from "blockstack";
import { UserSessionChat } from "./UserSessionChat";

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
      return {
        ...state,
        currentEvent: action.payload.eventInfo,
        currentEventType: action.payload.eventType
      };
    case REMOVE_EVENT:
      var newState = state;
      newState.allEvents = newState.allEvents.filter(function(obj) {
        return obj && obj.id !== action.payload.obj.id;
      });
      publishEvents(action.payload.obj.uid, removePublicEvent);
      saveEvents("default", newState.allEvents);
      return newState;
    case ADD_EVENT:
      var newState2 = state;
      action.payload.calendarName = "default";
      newState2.allEvents.push(action.payload);
      if (action.payload.public) {
        publishEvents(action.payload, addPublicEvent);
      }
      saveEvents("default", newState2.allEvents);
      window.history.pushState({}, "OI Calendar", "/");
      delete newState2.currentEvent;
      delete newState2.currentEventType;
      return newState2;
    case UPDATE_EVENT:
      var newState3 = state;
      var eventInfo = action.payload.obj;
      newState3.allEvents[eventInfo.id] = eventInfo;
      if (eventInfo.public) {
        eventInfo.uid = eventInfo.uid || uuid();
        publishEvents(eventInfo, updatePublicEvent);
      } else {
        if (eventInfo.uid) {
          publishEvents(eventInfo.uid, removePublicEvent);
        }
      }
      saveEvents("default", newState3.allEvents);
      return newState3;
    case INVITES_SENT:
      var allEvents = state.allEvents;
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
