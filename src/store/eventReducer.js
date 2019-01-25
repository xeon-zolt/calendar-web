import * as types from './eventActionTypes';
import { publishEvent } from './eventAction';
import * as blockstack from "blockstack";
import { UserSessionChat } from './UserSessionChat';

let initialState = {
    allEvents: [],
    userSessionChat: new UserSessionChat(),
    contacts: {},
    user: '',
}

export default function reduce(state = initialState, action = {}) {
    switch (action.type) {
        case types.USER:
            return { ...state, user: action.user }
        case types.ALL_CONTACTS:
            return { ...state, contacts: action.contacts }
        case types.ALL_EVENTS:
            return { ...state, allEvents: action.allEvents }
        case types.REMOVE_EVENT:
            var newState = state;
            newState.allEvents = newState.allEvents.filter(function (obj) {
                return obj && obj.id !== action.payload;
            });
            blockstack.putFile("AllEvents", JSON.stringify(newState.allEvents));
            return newState;
        case types.ADD_EVENT:
            var newState2 = state;
            newState2.allEvents.push(action.payload);
            if (action.payload.public) {
                publishEvent(action.payload, state.auth.user.username)
            }
            console.log("new state after add event", newState2)
            blockstack.putFile("AllEvents", JSON.stringify(newState2.allEvents))
            return newState2;
        case types.UPDATE_EVENT:
            var newState3 = state;
            newState3.allEvents[action.payload.id] = action.payload.obj;
            if (action.payload.obj.public) {
                publishEvent(action.payload.obj, state.user.username)
            }
            blockstack.putFile("AllEvents", JSON.stringify(newState3.allEvents));
            return newState3;
        case types.INVITES_SENT:
            var allEvents = state.allEvents
            if (action.payload.type === "add") {
                console.log("add")
                allEvents.push(action.payload.eventInfo);
                blockstack.putFile("AllEvents", JSON.stringify(allEvents));
            }
            return { ...state, allEvents, inviteSuccess: true, inviteError: undefined };
        case types.SEND_INVITES_FAILED:
            return { ...state, inviteSuccess: false, inviteError: action.payload.error }
        case types.CURRENT_GUESTS:
            return { ...state, currentGuests: action.payload.profiles, inviteSuccess: undefined, inviteError: undefined };
        default:
            return state;
    }
}
