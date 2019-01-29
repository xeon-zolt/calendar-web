import { AUTH_SIGN_IN, AUTH_SIGN_OUT } from "../ActionTypes";

export function SignUserIn() {
  return async (dispatch, getState) => {
    dispatch({ type: AUTH_SIGN_IN });
  };
}

export function SignUserOut() {
  return async (dispatch, getState) => {
    dispatch({ type: AUTH_SIGN_OUT });
  };
}
