import { AUTH_SIGN_IN, AUTH_SIGN_OUT } from '../ActionTypes'
import { redirectToSignIn, signUserOut as signUserOutService } from 'blockstack'

export function signUserInAction() {
  return { type: AUTH_SIGN_IN }
}

export function signUserIn(store) {
  return async (dispatch, getState) => {
    try {
      redirectToSignIn(
        `${window.location}`,
        `${window.location.origin}/manifest.json`,
        ['store_write', 'publish_data']
      )
      signUserInAction()
    } catch (e) {
      console.error(e)
    }
  }
}

export function signUserOut() {
  try {
    signUserOutService()
    return { type: AUTH_SIGN_OUT }
  } catch (e) {
    console.error(e)
  }
}
