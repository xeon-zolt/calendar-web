import {
  AUTH_SIGN_IN,
  AUTH_SIGN_OUT,
  AUTH_CONNECTING,
  AUTH_CONNECTED,
  AUTH_DISCONNECTED
} from "../ActionTypes";

let initialState = {
  user: undefined,
  userMessage: ""
};

export default function reduce(state = initialState, action = {}) {
  const { type, payload } = action;
  let newState = state;
  switch (type) {
    case AUTH_CONNECTED:
      newState = { ...state, user: action.user };
      break;
    case AUTH_CONNECTING:
      newState = { ...state, userMessage: "connecting" };
      break;
    case AUTH_DISCONNECTED:
      newState = { ...state, user: undefined, userMessage: "disconnected" };
      break;
    case AUTH_SIGN_IN:
      newState = { ...state, userMessage: "redirecting to sign-in" };
      break;
    case AUTH_SIGN_OUT:
      newState = { ...state, user: undefined, userMessage: "signed out" };
      break;
    default:
      newState = state;
      break;
  }
  return newState;
}
