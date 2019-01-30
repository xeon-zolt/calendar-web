import {
  ALL_EVENTS,
  INVITES_SENT,
  SEND_INVITES_FAILED,
  CURRENT_GUESTS,
  USER,
  ALL_CONTACTS,
  VIEW_EVENT,
  ADD_CALENDAR
} from "../ActionTypes";
import { AUTH_CONNECTED, AUTH_DISCONNECTED } from "../ActionTypes";

import { defaultEvents, defaultCalendars } from "../../io/eventDefaults";

import {
  saveEvents,
  publishEvents,
  ViewEventInQueryString as handleIntentsInQueryString,
  importCalendarEvents,
  getCalendars,
  respondToInvite,
  sendInvitesToGuests,
  loadGuestProfiles,
  fetchContactData,
  createSessionChat
} from "../../io/event";

import {
  isUserSignedIn,
  loadUserData,
  isSignInPending,
  handlePendingSignIn,
  loadUserData
} from "blockstack";
import { UserSessionChat } from "./UserSessionChat";
import { createEvents } from "ics";
import {
  parse as iCalParse,
  Component as iCalComponent,
  Event as iCalEvent
} from "ical.js";

// #########################
// INVITES
// #########################

function asAction_invitesSentOk(eventInfo, type) {
  return {
    type: INVITES_SENT,
    payload: { eventInfo, type }
  };
}

function asAction_invitesSentFail(error) {
  return {
    type: SEND_INVITES_FAILED,
    payload: { error }
  };
}

export function SendInvites(eventInfo, guests, type) {
  return async (dispatch, getState) => {
    sendInvitesToGuests(getState(), eventInfo, guests).then(
      ({ eventInfo, contacts }) => {
        dispatch(asAction_invitesSentOk(eventInfo, type));
      },
      error => {
        dispatch(asAction_invitesSentFail(error));
      }
    );
  };
}

// #########################
// GUESTS
// #########################
function asAction_setGuests(profiles, eventInfo) {
  return {
    type: CURRENT_GUESTS,
    payload: { profiles, eventInfo }
  };
}

export function LoadGuestList(guests, eventInfo) {
  return async (dispatch, getState) => {
    const contacts = getState().events.contacts;
    loadGuestProfiles(guests, contacts).then(
      ({ profiles, contacts }) => {
        console.log("profiles", profiles);
        dispatch(asAction_setGuests(profiles, eventInfo));
      },
      error => {
        console.log("load guest list failed", error);
      }
    );
  };
}

// ################
// LOAD USER DATA
// ################

function asAction_authenticated(userData) {
  return { type: AUTH_CONNECTED, user: userData };
}

function asAction_disconnected() {
  return { type: AUTH_DISCONNECTED };
}

function asAction_user(userData) {
  return { type: USER, user: userData };
}

function asAction_viewEvent(eventInfo) {
  return { type: VIEW_EVENT, payload: { eventInfo } };
}

function asAction_setEvents(allEvents) {
  return { type: ALL_EVENTS, allEvents };
}

function asAction_setContacts(contacts) {
  return { type: ALL_CONTACTS, payload: { contacts } };
}

export function getInitialEvents(query) {
  return async (dispatch, getState) => {
    if (isUserSignedIn()) {
      console.log("is signed in");
      const userData = loadUserData();
      dispatch(asAction_authenticated(userData));
      dispatch(asAction_user(userData));

      handleIntentsInQueryString(
        query,
        eventInfo => {
          dispatch(asAction_viewEvent(eventInfo));
        },
        eventInfo =>
          dispatch({
            type: VIEW_EVENT,
            payload: { eventInfo, eventType: "add" }
          }),
        url =>
          dispatch({
            type: ADD_CALENDAR,
            payload: { url }
          })
      );

      getCalendars(defaultCalendars).then(calendars => {
        loadCalendarData(calendars).then(allEvents => {
          dispatch(asAction_setEvents(allEvents));
        });
        fetchContactData().then(contacts => {
          dispatch(asAction_setContacts(contacts));
        });
      });
    } else if (isSignInPending()) {
      console.log("handling pending sign in");
      handlePendingSignIn().then(userData => {
        console.log("redirecting to " + window.location.origin);
        window.location = window.location.origin;
        dispatch(asAction_authenticated(userData));
      });
    } else {
      dispatch(asAction_disconnected());
    }
  };
}

function loadCalendarData(calendars) {
  let calendarEvents = {};
  let calendarPromises = Promise.resolve(calendarEvents);
  for (let i in calendars) {
    const calendar = calendars[i];
    calendarPromises = calendarPromises.then(calendarEvents => {
      return importCalendarEvents(calendar, defaultEvents).then(
        events => {
          calendarEvents[calendar.name] = {
            name: calendar.name,
            allEvents: events
          };
          return calendarEvents;
        },
        error => {
          console.log("error", error);
          return calendarEvents;
        }
      );
    });
  }
  return calendarPromises.then(calendarEvents => {
    var allCalendars = Object.values(calendarEvents);
    var allEvents = [].concat.apply([], allCalendars.map(c => c.allEvents));
    return allEvents;
  });
}
