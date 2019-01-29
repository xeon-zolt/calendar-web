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

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function sendInvitesToGuests(state, eventInfo, guests) {
  console.log("state", state);
  const contacts = state.events.contacts;
  eventInfo.privKey = blockstack.makeECPrivateKey();
  eventInfo.pubKey = blockstack.getPublicKeyFromPrivate(eventInfo.privKey);
  eventInfo.uuid = uuid();
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
              console.log("check", eventInfo, contacts);
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
  console.log("check in addGuest", eventInfo, contacts);
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

  console.log("check before room promise", eventInfo, contacts);
  return roomPromise.then(
    roomResult => {
      console.log("check after room", eventInfo, contacts);

      var roomId = roomResult.room_id;
      Object.assign(contacts[guest], { roomId });
      console.log("check after assign", eventInfo, contacts);

      return sendInviteMessage(
        guest,
        state.events.userSessionChat,
        roomId,
        eventInfo,
        state.auth.user.username,
        getUserAppAccount(state.auth.user)
      )
        .then(() => {
          console.log("check after invitation", eventInfo, contacts);
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
      eventInfo.uuid +
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
// console.log(respondToInvite);

export function GetInitialEvents() {
  return async (dispatch, getState) => {
    // console.log("get events");
    if (blockstack.isUserSignedIn()) {
      console.log("is signed in");
      const userData = blockstack.loadUserData();
      dispatch({ type: AUTH_CONNECTED, user: userData });
      dispatch({ type: USER, user: userData });

      loadCalendarData(dispatch);
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

function loadCalendars(dispatch) {
  blockstack.getFile("Calendars").then(calendarsContent => {
    var calendars;
    if (calendarsContent == null) {
      blockstack.putFile("Calendars", JSON.stringify(defaultCalendars));
      calendars = defaultCalendars;
    } else {
      calendars = JSON.parse(calendarsContent);
    }
    dispatch({ type: types.ALL_CALENDARS, payload: { calendars } });
  });
}

function loadCalendarData(dispatch) {
  let calendarEvents = {};
  let calendarPromises = Promise.resolve(calendarEvents);
  for (let i in calendars) {
    const calendar = calendars[i];
    calendarPromises = calendarPromises.then(calendarEvents => {
      return importCalendarEvents(calendar).then(events => {
        calendarEvents[calendar.name] = { name: calendar, allEvents: events };
        return calendarEvents;
      });
    });
  }
  calendarPromises.then(calendarEvents => {
    // console.log("cals", calendarEvents);
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
  const { type, data, hexColor } = calendar;
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
      return events.map(d => {
        d.hexColor = hexColorOrRandom;
        d.mode = calendar.mode;
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

function initializeWithEvents({ src, events }) {
  blockstack.putFile(src, JSON.stringify(events));
  return Promise.resolve(events);
}

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
  // console.log("importPublicEventsFromUser", { src, user });
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
  console.log("importPrivateEvents", { src });
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
  console.log("importPrivateEventsWithDefaults", { src });
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
  blockstack
    .getFile(sharedUrl(eventUid), { decrypt: false, username })
    .then(encryptedContent => {
      // var event = blockstack.decryptContent(encryptedContent, { privateKey });
      // console.log("shared event", event);
    });
}

/* :Q: why have this here instead of the previous flow?  */
/* :Note: this does nothing for now  */
loadCalendarEventFromUser(
  "friedger.id",
  "307baf34-9ceb-492f-8dab-ab595f2a09df",
  "e5f33c486af118a2c04f2d26fb1c4f698b22693e539600bb590510e24617dbc6"
);

// END of import options

export function publishEvents(event, remove) {
  event.uuid = uuid(); //TODO move this into event creation
  console.log("publishEvent ", event, event.uuid);
  const publicEventPath = "public/AllEvents";
  blockstack.getFile(publicEventPath, { decrypt: false }).then(fileContent => {
    var publicEvents = {};
    if (fileContent !== null) {
      publicEvents = JSON.parse(fileContent);
    }
    if (remove) {
      if (!publicEvents[event.uuid]) {
        //nothing to do
        return;
      } else {
        delete publicEvents[event.uuid];
      }
    } else {
      publicEvents[event.uuid] = event;
    }
    var eventsString = JSON.stringify(publicEvents);
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
      var { error, value } = ics.createEvents(formatEvents(publicEvents));
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
      console.log("e", e);
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
    ical.uid = event.uuid;
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
