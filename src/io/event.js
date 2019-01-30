import {
  uuid,
  eventAsIcs,
  guaranteeHexColor,
  sharedUrl,
  parseQueryString
} from "./eventFN";

import {
  lookupProfile,
  makeECPrivateKey,
  getPublicKeyFromPrivate,
  putFile,
  getFile,
  decryptContent
} from "blockstack";
import { createEvents } from "ics";

import { UserSessionChat } from "./UserSessionChat";
import {
  parse as iCalParse,
  Component as iCalComponent,
  Event as iCalEvent
} from "ical.js";

export function createSessionChat() {
  return new UserSessionChat();
}

export function fetchContactData() {
  return getFile("Contacts").then(contactsContent => {
    var contacts;
    if (contactsContent == null) {
      contacts = {};
    } else {
      contacts = JSON.parse(contactsContent);
    }
    return contacts;
  });
}

export function loadGuestProfiles(guests, contacts) {
  const profiles = {};
  var profilePromises = Promise.resolve({ profiles, contacts });

  for (var i in guests) {
    const guest = guests[i];
    if (guest && guest.length > 0) {
      profilePromises = profilePromises.then(({ profiles, contacts }) => {
        return lookupProfile(guest).then(
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

export function sendInvitesToGuests(state, eventInfo, guests) {
  const contacts = state.events.contacts;
  eventInfo.privKey = makeECPrivateKey();
  eventInfo.pubKey = getPublicKeyFromPrivate(eventInfo.privKey);
  eventInfo.uid = eventInfo.uid || uuid();
  eventInfo.owner = state.auth.user.username;
  return putFile(sharedUrl(eventInfo.uid), JSON.stringify(eventInfo), {
    encrypt: eventInfo.pubKey
  }).then(readUrl => {
    eventInfo.readUrl = readUrl;
    var addGuestPromises = Promise.resolve({ contacts, eventInfo });

    for (var i in guests) {
      const guest = guests[i];
      if (guest && guest.length > 0) {
        addGuestPromises = addGuestPromises.then(({ contacts, eventInfo }) => {
          return lookupProfile(guest).then(
            guestProfile => {
              console.log("found guest ", guestProfile.name);
              return addGuest(guest, eventInfo, contacts, state);
            },
            error => {
              console.log("invalid guest " + guest, error);
              return Promise.resolve({ contacts, eventInfo });
            }
          );
        });
      }
    }
    return addGuestPromises.then(
      ({ contacts, eventInfo }) => {
        console.log("contacts", contacts);
        return putFile("Contacts", JSON.stringify(contacts)).then(() => {
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

export function respondToInvite(
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

export function getCalendars(defaultCalendars) {
  return getFile("Calendars").then(calendarsContent => {
    var calendars;
    if (calendarsContent == null) {
      putFile("Calendars", JSON.stringify(defaultCalendars));
      calendars = defaultCalendars;
    } else {
      calendars = JSON.parse(calendarsContent);
    }
    return calendars;
  });
}

// ###########################################################################
// List of all available import functions as promises
// :NOTE: As there is no more reliance on any knowledge of how these evens are managed
// by the app, all import functions could be moved to a separate file
// ###########################################################################
export function importCalendarEvents(calendar, defaultEvents) {
  const { type, data, hexColor, name } = calendar;
  let fn;
  if (type === "ics") {
    fn = importCalendarEventsFromICS;
  } else if (type === "blockstack-user") {
    fn = importPublicEventsFromUser;
  } else if (type === "private") {
    if (name === "default") {
      fn = importPrivateEventsWithDefaults(defaultEvents);
    } else {
      fn = importPrivateEvents;
    }
  } else {
    fn = () => [];
  }
  return fn(data).then(events => {
    if (events) {
      console.log();
      const hexColorOrRandom = guaranteeHexColor(hexColor);
      const calendarName = type === "private" ? name : null;
      var event;
      return Object.keys(events).reduce((es, key) => {
        event = events[key];
        event.hexColor = hexColorOrRandom;
        event.mode = calendar.mode;
        event.calendarName = calendarName;
        es[key] = event;
        return es;
      }, {});
    } else {
      return {};
    }
  });
}

function importCalendarEventsFromICS({ src }) {
  return fetch(src)
    .then(result => result.text())
    .then(icsContent => {
      try {
        var jCal = iCalParse(icsContent);
        var comp = new iCalComponent(jCal);
        var vevents = comp.getAllSubcomponents("vevent");
        var allEvents = {};
        for (var i in vevents) {
          var vevent = new iCalEvent(vevents[i]);
          var event = {
            title: vevent.summary,
            start: vevent.startDate.toJSDate().toISOString(),
            end: vevent.endDate.toJSDate().toISOString(),
            uid: vevent.uid
          };
          allEvents[event.uid] = event;
        }
        return Promise.resolve(allEvents);
      } catch (e) {
        console.log("ics error", e);
        return;
      }
    });
}

function importPublicEventsFromUser({ src, user }) {
  return getFile(src, {
    decrypt: false,
    username: user
  }).then(allEvents => {
    if (allEvents && typeof allEvents === "string") {
      allEvents = JSON.parse(allEvents);
    } else {
      allEvents = {};
    }
    return Promise.resolve(allEvents);
  });
}

function importPrivateEvents({ src }) {
  return getFile(src).then(allEvents => {
    if (allEvents && typeof allEvents === "string") {
      allEvents = JSON.parse(allEvents);
    } else {
      allEvents = {};
    }
    return Promise.resolve(allEvents);
  });
}

function importPrivateEventsWithDefaults(defaultEvents) {
  return ({ src }) => {
    return getFile(src).then(allEvents => {
      if (allEvents && typeof allEvents === "string") {
        allEvents = JSON.parse(allEvents);
      } else {
        putFile(src, JSON.stringify(defaultEvents));
        allEvents = defaultEvents;
      }
      return Promise.resolve(allEvents);
    });
  };
}

export function ViewEventInQueryString(
  query,
  onPrivateEvent,
  onNewEvent,
  onICSUrl
) {
  if (query) {
    const { u, e, p, intent, title, start, end, via, url } = parseQueryString(
      query
    );
    if (u && e && p) {
      return loadCalendarEventFromUser(u, e, p).then(onPrivateEvent);
    } else if (intent) {
      if (intent.toLowerCase() === "addevent") {
        const eventInfo = {};
        eventInfo.title = title || "New Event";
        eventInfo.start = start != null ? new Date(start) : new Date();
        eventInfo.end = end != null ? new Date(end) : null;
        eventInfo.owner = via != null ? via : userData.username;
        onNewEvent(eventInfo);
      } else if (intent.toLowerCase === "addics") {
        onICSUrl(url);
      }
    }
  }
}

function loadCalendarEventFromUser(username, eventUid, privateKey) {
  return getFile(sharedUrl(eventUid), { decrypt: false, username }).then(
    encryptedContent => {
      return JSON.parse(decryptContent(encryptedContent, { privateKey }));
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
  getFile(publicEventPath, { decrypt: false }).then(fileContent => {
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
      putFile(publicEventPath, eventsString, {
        encrypt: false,
        contentType: "text/json"
      }).then(
        f => {
          console.log("public calendar at ", f);
        },
        error => {
          console.log("error publish event", error);
        }
      );
      try {
        var { error, value } = createEvents(newPublicEvents.map(eventAsIcs));
        if (!error) {
          putFile(publicEventPath + ".ics", value, {
            encrypt: false,
            contentType: "text/calendar"
          }).then(
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

export function saveEvents(calendarName, allEvents) {
  console.log("save", { calendarName, allEvents });
  const calendarEvents = Object.keys(allEvents)
    .filter(key => allEvents[key].calendarName === calendarName)
    .reduce((res, key) => {
      res[key] = allEvents[key];
      return res;
    }, {});

  putFile(calendarName + "/AllEvents", JSON.stringify(calendarEvents));
}
