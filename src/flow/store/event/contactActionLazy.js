import {
  SET_CONTACTS,
  INVITES_SENT_OK,
  INVITES_SENT_FAIL,
  UNSET_CURRENT_INVITES,
} from '../ActionTypes'

import {
  fetchContactData,
  publishContacts,
  sendInvitesToGuests,
  loadGuestProfiles,
} from '../../io/event'

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
      console.log('')
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

export function addContact(contact) {
  return (dispatch, getState) => {
    fetchContactData().then(contacts => {
      // TODO check for duplicates
      contacts.push(contact)
      resetContacts(contacts)
    })
  }
}

export function deleteContacts(deleteList) {
  return (dispatch, getState) => {
    fetchContactData().then(contacts => {
      for (var i in deleteList) {
        delete contacts[deleteList[i].username]
      }
      resetContacts(contacts)
    })
  }
}

// #########################
// INVITES
// #########################

function invitesSentOkAction() {
  return {
    type: INVITES_SENT_OK,
  }
}

function invitesSentFailAction(error, eventType, eventInfo) {
  return {
    type: INVITES_SENT_FAIL,
    payload: { error, eventType, eventInfo },
  }
}
export function unsetCurrentInvites() {
  return { type: UNSET_CURRENT_INVITES }
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
        dispatch(invitesSentOkAction())
        return Promise.resolve()
      },
      error => {
        dispatch(invitesSentFailAction(error))
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
