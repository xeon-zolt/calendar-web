import {
  AUTH_SIGN_IN,
  AUTH_SIGN_OUT,
  AUTH_CONNECTING,
  AUTH_CONNECTED,
  AUTH_DISCONNECTED
} from "../ActionTypes";

import { userSignIn, userSignOut } from "./authAction";

let initialState = {
  user: undefined,
  userMessage: ""
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case AUTH_CONNECTED:
      return { ...state, user: action.user };
    case AUTH_CONNECTING:
      return { ...state, userMessage: "connecting" };
    case AUTH_DISCONNECTED:
      return { ...state, user: undefined, userMessage: "disconnected" };
    case AUTH_SIGN_IN:
      try {
        userSignIn();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
      return { ...state, userMessage: "redirecting to sign-in" };
    case AUTH_SIGN_OUT:
      try {
        userSignOut();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
      return { ...state, user: undefined, userMessage: "signed out" };
    default:
      return state;
  }
}
