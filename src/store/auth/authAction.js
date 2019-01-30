import { AUTH_SIGN_IN, AUTH_SIGN_OUT } from "../ActionTypes";
import { redirectToSignIn, signUserOut } from "blockstack";

export function asAction_SignUserIn() {
  return { type: AUTH_SIGN_IN };
}

export function userSignIn() {
  redirectToSignIn(
    `${window.location}`,
    `${window.location.origin}/manifest.json`,
    ["store_write", "publish_data"]
  );
}

export function asAction_SignUserOut() {
  return { type: AUTH_SIGN_OUT };
}

export function userSignOut() {
  signUserOut();
}
