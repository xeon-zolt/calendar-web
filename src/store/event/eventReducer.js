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
  CURRENT_GUESTS
} from "../ActionTypes";

import { publishEvents } from "./eventAction";
import { putFile } from "blockstack";
import { UserSessionChat } from "./UserSessionChat";

let initialState = {
  allEvents: [],
  userSessionChat: new UserSessionChat(),
  contacts: {},
  user: ""
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case USER:
      return { ...state, user: action.user };
    case ALL_CONTACTS:
      // console.log('all contacts', action.payload.contacts);
      return { ...state, contacts: action.payload.contacts };
    case ALL_EVENTS:
      return { ...state, allEvents: action.allEvents };
    case REMOVE_EVENT:
      var newState = state;
      newState.allEvents = newState.allEvents.filter(function(obj) {
        return obj && obj.id !== action.payload;
      });
      publishEvents(action.payload, true);
      putFile("AllEvents", JSON.stringify(newState.allEvents));
      return newState;
    case ADD_EVENT:
      var newState2 = state;
      newState2.allEvents.push(action.payload);
      if (action.payload.public) {
        publishEvents(action.payload, false);
      }
      // console.log("new state after add event", newState2);
      putFile("AllEvents", JSON.stringify(newState2.allEvents));
      return newState2;
    case UPDATE_EVENT:
      var newState3 = state;
      newState3.allEvents[action.payload.id] = action.payload.obj;
      if (action.payload.obj.public) {
        publishEvents(action.payload.obj, false);
      }
      putFile("AllEvents", JSON.stringify(newState3.allEvents));
      return newState3;
    case INVITES_SENT:
      var allEvents = state.allEvents;
      if (action.payload.type === "add") {
        // console.log("add");
        allEvents.push(action.payload.eventInfo);
        putFile("AllEvents", JSON.stringify(allEvents));
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
