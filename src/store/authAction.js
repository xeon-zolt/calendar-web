import * as authTypes from "../store/authActionTypes";

export function SignUserIn() {
  return async (dispatch, getState) => {
    dispatch({ type: authTypes.AUTH_SIGN_IN });
  };
}

export function SignUserOut() {
  return async (dispatch, getState) => {
    dispatch({ type: authTypes.AUTH_SIGN_OUT });
  };
}
