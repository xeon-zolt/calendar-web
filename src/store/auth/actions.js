import { AUTH_SIGN_IN, AUTH_SIGN_OUT } from '../ActionTypes'
import { UserSession } from 'blockstack'
import { AppConfig } from 'blockstack/lib/auth'

export function redirectedToSignIn() {
  return { type: AUTH_SIGN_IN }
}

export function signUserIn(store) {
  return async (dispatch, getState) => {
    const userSession = new UserSession(
      new AppConfig(
        ['store_write'],
        `${window.location.origin}`,
        `${window.location}`,
        `${window.location.origin}/manifest.json`
      )
    )
    try {
      userSession.redirectToSignIn()
      dispatch(redirectedToSignIn())
    } catch (e) {
      console.error(e)
    }
  }
}

export function signUserOut() {
  const userSession = new UserSession(
    new AppConfig(
      ['store_write', 'publish_data'],
      `${window.location.origin}`,
      `${window.location}`,
      `${window.location.origin}/manifest.json`
    )
  )
  try {
    userSession.signUserOut()
    return { type: AUTH_SIGN_OUT }
  } catch (e) {
    console.error(e)
  }
}
