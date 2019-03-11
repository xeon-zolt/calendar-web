import {
  SET_CONTACTS,
  INVITES_SENT_OK,
  INVITES_SENT_FAIL,
  UNSET_CURRENT_INVITES,
  SET_INVITE_SEND_STATUS,
} from '../ActionTypes'

import {
  fetchContactData,
  publishContacts,
  sendInvitesToGuests,
  loadGuestProfiles,
} from '../../core/event'

function resetContacts(contacts) {
  return (dispatch, getState) => {
    publishContacts(contacts)
    dispatch({ type: SET_CONTACTS, payload: contacts })
  }
}

// ################
// When initializing app
// ################

export function initializeContactData() {
  return async (dispatch, getState) => {
    fetchContactData().then(contacts => {
      dispatch(resetContacts(contacts))
    })
  }
}

// ################
// In Settings
// ################

export function lookupContacts() {
  return (dispatch, getState) => {
    return Promise.reject(new Error('not yet implemented'))
  }
}

export function addContact(username, contact) {
  return (dispatch, getState) => {
    fetchContactData().then(contacts => {
      contacts[username] = { ...contacts[username], ...contact }
      dispatch(resetContacts(contacts))
    })
  }
}

export function deleteContacts(deleteList) {
  return (dispatch, getState) => {
    fetchContactData().then(contacts => {
      for (var i in deleteList) {
        delete contacts[deleteList[i].username]
      }
      dispatch(resetContacts(contacts))
    })
  }
}

// #########################
// INVITES
// #########################

function invitesSentSuccess() {
  return {
    type: INVITES_SENT_OK,
  }
}

function invitesSentFailure(error, eventType, eventInfo) {
  return {
    type: INVITES_SENT_FAIL,
    payload: { error, eventType, eventInfo },
  }
}
export function unsetCurrentInvites() {
  return { type: UNSET_CURRENT_INVITES }
}
export function setInviteStatus(status) {
  return { type: SET_INVITE_SEND_STATUS, payload: { status } }
}
export function sendInvites(eventInfo, guests) {
  return async (dispatch, getState) => {
    const state = getState()
    sendInvitesToGuests(
      state.events.contacts,
      state.auth.user,
      eventInfo,
      guests,
      state.events.userSessionChat
    ).then(
      () => {
        dispatch(invitesSentSuccess())
        return Promise.resolve()
      },
      error => {
        dispatch(invitesSentFailure(error))
        return Promise.reject(error)
      }
    )
  }
}

// #########################
// GUESTS
// #########################

export function loadGuestList(guests, contacts, asyncReturn) {
  console.log('loadGuestList', guests, contacts)
  loadGuestProfiles(guests, contacts).then(
    ({ profiles, contacts }) => {
      asyncReturn({ profiles, contacts })
    },
    error => {
      console.log('load guest list failed', error)
    }
  )
}
