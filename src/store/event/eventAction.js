import {
  ALL_EVENTS,
  INVITES_SENT,
  SEND_INVITES_FAILED,
  CURRENT_GUESTS,
  USER,
  ALL_CONTACTS
} from "../ActionTypes";

import { AUTH_CONNECTED, AUTH_DISCONNECTED } from "../ActionTypes";
import moment from "moment";
import * as blockstack from "blockstack";
import * as ics from "ics";
import * as ICAL from "ical.js";

export function SendInvites(eventInfo, guests, type) {
  return async (dispatch, getState) => {
    sendInvitesToGuests(getState(), eventInfo, guests).then(
      ({ eventInfo, contacts }) => {
        dispatch({
          type: INVITES_SENT,
          payload: { eventInfo, type }
        });
      },
      error => {
        dispatch({
          type: SEND_INVITES_FAILED,
          payload: { error }
        });
      }
    );
  };
}

export function LoadGuestList(guests, eventInfo) {
  return async (dispatch, getState) => {
    const contacts = getState().events.contacts;
    loadGuestProfiles(guests, contacts).then(
      ({ profiles, contacts }) => {
        console.log("profiles", profiles);
        dispatch({
          type: CURRENT_GUESTS,
          payload: { profiles, eventInfo }
        });
      },
      error => {
        console.log("load guest list failed", error);
      }
    );
  };
}

function loadGuestProfiles(guests, contacts) {
  const profiles = {};
  var profilePromises = Promise.resolve({ profiles, contacts });

  for (var i in guests) {
    const guest = guests[i];
    if (guest && guest.length > 0) {
      profilePromises = profilePromises.then(({ profiles, contacts }) => {
        return blockstack.lookupProfile(guest).then(
          guestProfile => {
            profiles[guest] = guestProfile;
            return { profiles, contacts };
          },
          error => {
            console.log("invalid guest " + guest, error);
            return Promise.resolve({ profiles, contacts });
          }
        );
      });
    }
  }
  return profilePromises;
}

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function sendInvitesToGuests(state, eventInfo, guests) {
  const contacts = state.events.contacts;
  eventInfo.privKey = blockstack.makeECPrivateKey();
  eventInfo.pubKey = blockstack.getPublicKeyFromPrivate(eventInfo.privKey);
  eventInfo.uid = eventInfo.uid || uuid();
  eventInfo.owner = state.auth.user.username;
  return blockstack
    .putFile(sharedUrl(eventInfo.uuid), JSON.stringify(eventInfo), {
      encrypt: eventInfo.pubKey
    })
    .then(readUrl => {
      eventInfo.readUrl = readUrl;
      var addGuestPromises = Promise.resolve({ contacts, eventInfo });

      for (var i in guests) {
        const guest = guests[i];
        if (guest && guest.length > 0) {
          addGuestPromises = addGuestPromises.then(
            ({ contacts, eventInfo }) => {
              return blockstack.lookupProfile(guest).then(
                guestProfile => {
                  console.log("found guest ", guestProfile.name);
                  return addGuest(guest, eventInfo, contacts, state);
                },
                error => {
                  console.log("invalid guest " + guest, error);
                  return Promise.resolve({ contacts, eventInfo });
                }
              );
            }
          );
        }
      }
      return addGuestPromises.then(
        ({ contacts, eventInfo }) => {
          console.log("contacts", contacts);
          return blockstack
            .putFile("Contacts", JSON.stringify(contacts))
            .then(() => {
              return { contacts, eventInfo };
            });
        },
        error => {
          return Promise.reject(error);
        }
      );
    });
}

function addGuest(guest, eventInfo, contacts, state) {
  var roomPromise;
  if (contacts[guest] && contacts[guest].roomId) {
    console.log("reusing room");
    roomPromise = Promise.resolve({ room_id: contacts[guest].roomId });
  } else {
    console.log("creating new room");
    if (!contacts[guest]) {
      contacts[guest] = {};
    }
    roomPromise = state.events.userSessionChat.createNewRoom(
      "Events with " + state.events.user.username,
      "Invitations, Updates,.."
    );
  }

  return roomPromise.then(
    roomResult => {
      var roomId = roomResult.room_id;
      Object.assign(contacts[guest], { roomId });

      return sendInviteMessage(
        guest,
        state.events.userSessionChat,
        roomId,
        eventInfo,
        state.auth.user.username,
        getUserAppAccount(state.auth.user)
      )
        .then(() => {
          return { contacts, eventInfo };
        })
        .catch(error => {
          console.log("Invitation not sent", error);
          return { contacts, eventInfo };
        });
    },
    error => {
      console.log("room failure", error);
      return Promise.reject(error);
    }
  );
}

function sharedUrl(eventUid) {
  return "shared/" + eventUid + "/event.json";
}

function getUserAppAccount(user) {
  const gaiaUrl = user.apps[window.location.origin];
  if (gaiaUrl) {
    const urlParts = gaiaUrl.split("/");
    var appUserAddress = urlParts[urlParts.length - 2];
    return addressToAccount(appUserAddress);
  }
}

function addressToAccount(address) {
  // TODO lookup home server for user
  return "@" + address.toLowerCase() + ":openintents.modular.im";
}

function sendInviteMessage(
  guest,
  userSessionChat,
  roomId,
  eventInfo,
  username,
  userAppAccount
) {
  return userSessionChat.sendMessage(guest, roomId, {
    msgtype: "m.text",
    body: "You are invited to " + eventInfo.title,
    format: "org.matrix.custom.html",
    formatted_body:
      "You are invited to <a href='" +
      window.location.origin +
      "?u=" +
      username +
      "&e=" +
      eventInfo.uid +
      "&p=" +
      eventInfo.privKey +
      "&r=" +
      roomId +
      "&s=" +
      userAppAccount +
      "'>" +
      eventInfo.title +
      "</a>"
  });
}

function respondToInvite(
  userSessionChat,
  eventInfo,
  rsvp,
  senderAppAccount,
  roomId
) {
  var text;
  if (rsvp) {
    text = "I will come to " + eventInfo.title;
  } else {
    text = "I won't come to " + eventInfo.title;
  }
  return userSessionChat.sendMessage(senderAppAccount, roomId, {
    msgtype: "m.text",
    body: text
  });
}

export function GetInitialEvents() {
  return async (dispatch, getState) => {
    if (blockstack.isUserSignedIn()) {
      console.log("is signed in");
      const userData = blockstack.loadUserData();
      dispatch({ type: AUTH_CONNECTED, user: userData });
      dispatch({ type: USER, user: userData });
      getCalendars().then(calendars => {
        loadCalendarData(dispatch, calendars);
      });
    } else if (blockstack.isSignInPending()) {
      console.log("handling pending sign in");
      blockstack.handlePendingSignIn().then(userData => {
        console.log("redirecting to " + window.location.origin);
        window.location = window.location.origin;
        dispatch({ type: AUTH_CONNECTED, user: userData });
      });
    } else {
      dispatch({ type: AUTH_DISCONNECTED });
    }
  };
}

const defaultEvents = [
  {
    id: 0,
    title: "Today!",
    allDay: true,
    start: new Date(moment()),
    end: new Date(moment()),
    hexColor: "#265985",
    notes: "Have a great day!"
  }
];

const defaultCalendars = [
  {
    type: "private",
    name: "default",
    data: { src: "default/AllEvents", events: defaultEvents }
  },
  {
    type: "blockstack-user",
    name: "public@friedger.id",
    mode: "read-only",
    data: { user: "friedger.id", src: "public/AllEvents" }
  },
  {
    type: "ics",
    name: "holidays",
    mode: "read-only",
    data: {
      src:
        "https://calendar.google.com/calendar/ical/de.be%23holiday%40group.v.calendar.google.com/public/basic.ics"
    },
    hexColor: "#b8004f"
  }
];

function getCalendars() {
  return blockstack.getFile("Calendars").then(calendarsContent => {
    var calendars;
    if (calendarsContent == null) {
      blockstack.putFile("Calendars", JSON.stringify(defaultCalendars));
      calendars = defaultCalendars;
    } else {
      calendars = JSON.parse(calendarsContent);
    }
    return calendars;
  });
}

function loadCalendarData(dispatch, calendars) {
  let calendarEvents = {};
  let calendarPromises = Promise.resolve(calendarEvents);
  for (let i in calendars) {
    const calendar = calendars[i];
    calendarPromises = calendarPromises.then(calendarEvents => {
      return importCalendarEvents(calendar).then(
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
  calendarPromises.then(calendarEvents => {
    var allCalendars = Object.values(calendarEvents);
    var allEvents = [].concat.apply([], allCalendars.map(c => c.allEvents));
    dispatch({ type: ALL_EVENTS, allEvents });
  });

  blockstack.getFile("Contacts").then(contactsContent => {
    var contacts;
    if (contactsContent == null) {
      contacts = {};
    } else {
      contacts = JSON.parse(contactsContent);
    }
    dispatch({ type: ALL_CONTACTS, payload: { contacts } });
  });
}

function guaranteeHexColor(hex) {
  return hex || "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function importCalendarEvents(calendar) {
  const { type, data, hexColor, name } = calendar;
  let fn;
  if (type === "ics") {
    fn = importCalendarEventsFromICS;
  } else if (type === "blockstack-user") {
    fn = importPublicEventsFromUser;
  } else if (type === "private") {
    if (name === "default") {
      fn = importPrivateEventsWithDefaults;
    } else {
      fn = importPrivateEvents;
    }
  } else {
    fn = () => [];
  }
  return fn(data).then(events => {
    if (events) {
      const hexColorOrRandom = guaranteeHexColor(hexColor);
      const calendarName = type === "private" ? name : null;
      return events.map(d => {
        d.hexColor = hexColorOrRandom;
        d.mode = calendar.mode;
        d.calendarName = calendarName;
        return d;
      });
    }
  });
}

// ###########################################################################
// List of all available import functions as promises
// :NOTE: As there is no more reliance on any knowledge of how these evens are managed
// by the app, all import functions could be moved to a separate file
// ###########################################################################

function importCalendarEventsFromICS({ src }) {
  return fetch(src)
    .then(result => result.text())
    .then(icsContent => {
      try {
        var jCal = ICAL.parse(icsContent);
        var comp = new ICAL.Component(jCal);
        var vevents = comp.getAllSubcomponents("vevent");
        var allEvents = [];
        for (var i in vevents) {
          var vevent = new ICAL.Event(vevents[i]);
          var event = {
            title: vevent.summary,
            start: vevent.startDate.toJSDate().toISOString(),
            end: vevent.endDate.toJSDate().toISOString(),
            uid: vevent.uid
          };
          allEvents.push(event);
        }
        return Promise.resolve(allEvents);
      } catch (e) {
        console.log("ics error", e);
        return;
      }
    });
}

function importPublicEventsFromUser({ src, user }) {
  return blockstack
    .getFile(src, {
      decrypt: false,
      username: user
    })
    .then(allEvents => {
      if (allEvents && typeof allEvents === "string") {
        allEvents = JSON.parse(allEvents);
        allEvents = Object.values(allEvents); // convert from public calendar
      } else {
        allEvents = [];
      }
      return Promise.resolve(allEvents);
    });
}

function importPrivateEvents({ src }) {
  return blockstack.getFile(src).then(allEvents => {
    if (allEvents && typeof allEvents === "string") {
      allEvents = JSON.parse(allEvents);
    } else {
      allEvents = [];
    }
    return Promise.resolve(allEvents);
  });
}

function importPrivateEventsWithDefaults({ src }) {
  return blockstack.getFile(src).then(allEvents => {
    if (allEvents && typeof allEvents === "string") {
      allEvents = JSON.parse(allEvents);
    } else {
      blockstack.putFile(src, JSON.stringify(defaultEvents));
      allEvents = defaultEvents;
    }
    return Promise.resolve(allEvents);
  });
}

function loadCalendarEventFromUser(username, eventUid, privateKey) {
  return blockstack
    .getFile(sharedUrl(eventUid), { decrypt: false, username })
    .then(
      encryptedContent => {
        return blockstack.decryptContent(encryptedContent, { privateKey });
      },
      error => {
        return Promise.reject("Couldn't load event", {
          username,
          eventUid,
          error
        });
      }
    );
}

/* This is here just to demonstrate how to load an event from a user */
loadCalendarEventFromUser(
  "friedger.id",
  "307baf34-9ceb-492f-8dab-ab595f2a09df",
  "e5f33c486af118a2c04f2d26fb1c4f698b22693e539600bb590510e24617dbc6"
);

// END of import options

export function addPublicEvent(eventInfo, publicEvents) {
  eventInfo.uid = eventInfo.uid || uuid();

  publicEvents[eventInfo.uid] = eventInfo;
  return { republish: true, publicEvents };
}

export function updatePublicEvent(eventInfo, publicEvents) {
  publicEvents[eventInfo.uid] = eventInfo;
  return { republish: true, publicEvents };
}

export function removePublicEvent(eventUid, publicEvents) {
  if (!publicEvents[eventUid]) {
    //nothing to do
    return { republish: false, publicEvents };
  } else {
    delete publicEvents[eventUid];
    return { republish: true, publicEvents };
  }
}

export function publishEvents(param, updatePublicEvents) {
  const publicEventPath = "public/AllEvents";
  blockstack.getFile(publicEventPath, { decrypt: false }).then(fileContent => {
    var publicEvents = {};
    if (fileContent !== null) {
      publicEvents = JSON.parse(fileContent);
    }

    var { republish, newPublicEvents } = updatePublicEvents(
      param,
      publicEvents
    );

    if (republish) {
      var eventsString = JSON.stringify(newPublicEvents);
      blockstack
        .putFile(publicEventPath, eventsString, {
          encrypt: false,
          contentType: "text/json"
        })
        .then(
          f => {
            console.log("public calendar at ", f);
          },
          error => {
            console.log("error publish event", error);
          }
        );
      try {
        var { error, value } = ics.createEvents(formatEvents(newPublicEvents));
        if (!error) {
          blockstack
            .putFile(publicEventPath + ".ics", value, {
              encrypt: false,
              contentType: "text/calendar"
            })
            .then(
              f => {
                console.log("public calendar at ", f);
              },
              error => {
                console.log("error publish event", error);
              }
            );
        } else {
          console.log("error creating ics", error);
        }
      } catch (e) {
        console.log("failed to format events for ics file", e);
      }
    }
  });
}

function formatEvents(events) {
  var icsEvents = [];
  for (var i in events) {
    const event = events[i];
    const ical = {};
    ical.title = event.title;
    ical.description = event.description;
    ical.start = dateToArray(event, new Date(event.start));
    ical.end = dateToArray(event, new Date(event.end));
    ical.uid = event.uid;
    icsEvents.push(ical);
  }
  console.log(icsEvents);
  return icsEvents;
}

function dateToArray(event, date) {
  if (event.allDay) {
    return [date.getFullYear(), date.getMonth() + 1, date.getDay()];
  } else {
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDay(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ];
  }
}
