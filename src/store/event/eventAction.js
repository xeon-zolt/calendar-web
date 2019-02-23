import { SET_CURRENT_EVENT, UNSET_CURRENT_EVENT } from '../ActionTypes'

export function setCurrentEvent(eventDetails, eventType) {
  return {
    type: SET_CURRENT_EVENT,
    payload: { currentEvent: eventDetails, currentEventType: eventType },
  }
}

export function unsetCurrentEvent() {
  return { type: UNSET_CURRENT_EVENT }
}

export function setCurrentEventUid(uid) {
  return { type: SET_CURRENT_EVENT, payload: { currentEventUid: uid } }
}
