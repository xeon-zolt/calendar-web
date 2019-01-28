import * as types from './eventActionTypes'
import * as authTypes from './authActionTypes'
import moment from 'moment';
import * as blockstack from "blockstack";
import * as ics from 'ics'
import * as ICAL from 'ical.js'

export function SendInvites(eventInfo, type) {
    return async (dispatch, getState) => {
        handleGuests(getState(), eventInfo).then(({ eventInfo, contacts }) => {
            dispatch({
                type: types.INVITES_SENT,
                payload: { eventInfo, type }
            })
        }, error => {
            dispatch({
                type: types.SEND_INVITES_FAILED,
                payload: { error }
            })
        })
    }
}

export function LoadGuestList(guests, eventInfo) {
    return async (dispatch, getState) => {
        const contacts = getState().events.contacts
        loadGuestProfiles(guests, contacts).then(({ profiles, contacts }) => {
            console.log("profiles", profiles)
            dispatch({
                type: types.CURRENT_GUESTS,
                payload: { profiles, eventInfo }
            })
        }, error => {
            console.log("load guest list failed", error)
        })
    }
}

function loadGuestProfiles(guests, contacts) {
    const profiles = {}
    var profilePromises = Promise.resolve({ profiles, contacts })

    for (var i in guests) {
        const guest = guests[i]
        if (guest && guest.length > 0) {
            profilePromises = profilePromises.then(({ profiles, contacts }) => {
                return blockstack.lookupProfile(guest).then((guestProfile) => {
                    profiles[guest] = guestProfile
                    return { profiles, contacts }
                }, (error) => {
                    console.log("invalid guest " + guest, error)
                    return Promise.resolve({ profiles, contacts })
                })
            })

        }
    }
    return profilePromises
}


function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}


function handleGuests(state, eventInfo) {
    console.log("state", state)
    const guestsString = eventInfo.guests
    const guests = guestsString.split(/[,\s]+/g)
    const contacts = state.events.contacts
    eventInfo.privKey = blockstack.makeECPrivateKey()
    eventInfo.pubKey = blockstack.getPublicKeyFromPrivate(eventInfo.privKey)
    eventInfo.uuid = uuid()
    eventInfo.owner = state.auth.user.username
    return blockstack.putFile("shared/" + eventInfo.uuid + "/event.json", JSON.stringify(eventInfo), { encrypt: eventInfo.pubKey })
        .then((readUrl) => {
            eventInfo.readUrl = readUrl
            var addGuestPromises = Promise.resolve({ contacts, eventInfo })

            for (var i in guests) {
                const guest = guests[i]
                if (guest && guest.length > 0) {
                    addGuestPromises = addGuestPromises.then(({ contacts, eventInfo }) => {
                        console.log("check", eventInfo, contacts)
                        return blockstack.lookupProfile(guest).then((guestProfile) => {
                            console.log("found guest ", guestProfile.name)
                            return addGuest(guest, eventInfo, contacts, state)
                        }, (error) => {
                            console.log("invalid guest " + guest, error)
                            return Promise.resolve({ contacts, eventInfo })
                        })
                    })

                }
            }
            return addGuestPromises.then(({ contacts, eventInfo }) => {
                console.log("contacts", contacts)
                return blockstack.putFile("Contacts", JSON.stringify(contacts))
                    .then(() => {
                        return { contacts, eventInfo }
                    })
            }, (error) => {
                return Promise.reject(error)
            })
        })
}

function addGuest(guest, eventInfo, contacts, state) {

    console.log("check in addGuest", eventInfo, contacts)
    var roomPromise
    if (contacts[guest] && contacts[guest].roomId) {
        console.log("reusing room")
        roomPromise = Promise.resolve({ room_id: contacts[guest].roomId })
    } else {
        console.log("creating new room")
        if (!contacts[guest]) {
            contacts[guest] = {}
        }
        roomPromise = state.events.userSessionChat.createNewRoom("Events with " + state.events.user.username, "Invitations, Updates,..")
    }

    console.log("check before room promise", eventInfo, contacts)
    return roomPromise.then(
        roomResult => {
            console.log("check after room", eventInfo, contacts)

            var roomId = roomResult.room_id
            Object.assign(contacts[guest], { roomId })
            console.log("check after assign", eventInfo, contacts)

            return sendInviteMessage(guest, state.events.userSessionChat, roomId, eventInfo, state.auth.user.username)
                .then(() => {
                    console.log("check after invitation", eventInfo, contacts)
                    return { contacts, eventInfo }
                })
                .catch((error) => {
                    console.log("Invitation not sent", error)
                    return { contacts, eventInfo }
                })
        }, error => {
            console.log("room failure", error)
            return Promise.reject(error)
        }
    )
}

function sendInviteMessage(guest, userSessionChat, roomId, eventInfo, username) {
    return userSessionChat.sendMessage(guest, roomId, {
        msgtype: "m.text",
        body: "You are invited to " + eventInfo.title,
        format: "org.matrix.custom.html",
        formatted_body: "You are invited to <a href='" + window.location.origin + "?u=" + username + "&e=" + eventInfo.uuid + "&p=" + eventInfo.privKey + "'>" + eventInfo.title + "</a>"
    })
}

export function GetInitialEvents() {
    return async (dispatch, getState) => {
        console.log("get events")
        if (blockstack.isUserSignedIn()) {
            console.log("is signed in")
            const userData = blockstack.loadUserData()
            dispatch({ type: authTypes.AUTH_CONNECTED, user: userData })
            dispatch({ type: types.USER, user: userData })

            loadCalendarData(dispatch)
        } else if (blockstack.isSignInPending()) {
            console.log("handling pending sign in")
            blockstack.handlePendingSignIn().then((userData) => {
                console.log("redirecting to " + window.location.origin)
                window.location = window.location.origin
                dispatch({ type: authTypes.AUTH_CONNECTED, user: userData })
            });
        } else {
            dispatch({ type: authTypes.AUTH_DISCONNECTED })
        }
    }

}

const defaultEvents = [{
    id: 0,
    title: 'Today!',
    allDay: true,
    start: new Date(moment()),
    end: new Date(moment()),
    hexColor: '#265985',
    notes: 'Have a great day!'
}];

function loadCalendarData(dispatch) {

    var calendars = [{ name: "default" }, { user: "friedger.id", name: "public" }, { ics: "https://calendar.google.com/calendar/ical/de.be%23holiday%40group.v.calendar.google.com/public/basic.ics" }]
    var calendarEvents = {}
    var calendarPromises = Promise.resolve(calendarEvents)
    for (var i in calendars) {
        var calendar = calendars[i]
        calendarPromises = calendarPromises.then(addCalendarEvents(calendar));
    }
    calendarPromises.then(calendarEvents => {
        console.log("cals", calendarEvents)
        var allCalendars = Object.values(calendarEvents)
        var allEvents = [].concat.apply([], allCalendars.map(c => c.allEvents))
        dispatch({ type: types.ALL_EVENTS, allEvents });
    })


    blockstack.getFile("Contacts").then((contacts) => {
        if (contacts == null) {
            contacts = {}
        }
        contacts = {}
        dispatch({ type: types.ALL_CONTACTS, contacts: JSON.parse(contacts) })
    });
}

function addCalendarEvents(calendar) {
    return (calendarEvents) => {
        if (calendar.ics) {
            return addCalendarEventsFromICS(calendarEvents, calendar)
        } else {
            return addCalendarEventsFromJSON(calendarEvents, calendar)
        }

        
    }
}

function addCalendarEventsFromICS(calendarEvents, calendar) {
    return fetch(calendar.ics).then(result => result.text())
        .then(icsContent => {
            try {
                var jCal = ICAL.parse(icsContent);
                var comp = new ICAL.Component(jCal);
                var vevents = comp.getAllSubcomponents("vevent");
                var allEvents = []
                var hexColor = calendar.hexColor | '#' + Math.floor(Math.random() * 16777215).toString(16)
                for (var i in vevents) {
                    var vevent = new ICAL.Event(vevents[i]);
                    var event = {
                        title: vevent.summary,
                        start: vevent.startDate.toJSDate().toISOString(),
                        end: vevent.endDate.toJSDate().toISOString(),
                        uid: vevent.uid,
                        hexColor                        
                    }
                    allEvents.push(event)
                }
                calendarEvents[calendar.ics] = {allEvents, hexColor, name:calendar.ics}
                return calendarEvents
            } catch (e) {
                console.log("ics error", e)
                return calendarEvents
            }
        })

}

function addCalendarEventsFromJSON(calendarEvents, calendar) {
    var options = {}
    if (calendar.user) {
        options.decrypt = false
        options.username = calendar.user
    }
    var path = calendar.name + "/AllEvents"
    return blockstack.getFile(path, options).then((allEve) => {
        var id = calendar.name
        if (calendar.user) {
            id = id + "@" + calendar.user
        }
        var allEvents
        if (allEve) {
            allEvents = JSON.parse(allEve);
        } else {
            if (!calendar.user && calendar.name === "default") {
                blockstack.putFile("default/AllEvents", JSON.stringify(defaultEvents));
            } else {
                if (calendar.user) {
                    allEvents = {}
                } else {
                    allEvents = []
                }
            }
        }

        if (calendar.user) {
            allEvents = Object.values(allEvents)  // convert from public calendar  
        }
        console.log("ALlEvents", allEvents)
        calendar.allEvents = allEvents
        calendar.hexColor = calendar.hexColor | '#' + Math.floor(Math.random() * 16777215).toString(16);
        calendarEvents[id] = calendar
        return Promise.resolve(calendarEvents)
    })
}

function loadCalendarEventFromUser(username, eventUid, privateKey) {
    blockstack.getFile("shared/" + eventUid + "/event.json", {decrypt:false, username}).then(
        encryptedContent => {
            var event = blockstack.decryptContent(encryptedContent, {privateKey})
            console.log("shared event", event)
        }
    )
}
loadCalendarEventFromUser("friedger.id", "307baf34-9ceb-492f-8dab-ab595f2a09df", "e5f33c486af118a2c04f2d26fb1c4f698b22693e539600bb590510e24617dbc6")

export function publishEvents(event, remove) {
    event.uuid = uuid() //TODO move this into event creation
    console.log("publishEvent ", event, event.uuid)
    const publicEventPath = "public/AllEvents"
    blockstack.getFile(publicEventPath, { decrypt: false }).then(
        fileContent => {
            var publicEvents = {}
            if (fileContent !== null) {
                publicEvents = JSON.parse(fileContent)
            }
            if (remove) {
                if (!publicEvents[event.uuid]) {
                    //nothing to do
                    return
                } else {
                    delete publicEvents[event.uuid]
                }
            } else {
                publicEvents[event.uuid] = event
            }
            var eventsString = JSON.stringify(publicEvents)
            blockstack.putFile(publicEventPath, eventsString, { encrypt: false, contentType: "text/json" }).then(f => {
                console.log("public calendar at ", f)
            }, error => {
                console.log("error publish event", error)
            })
            try {
                var { error, value } = ics.createEvents(formatEvents(publicEvents))
                if (!error) {
                    blockstack.putFile(publicEventPath + ".ics", value, { encrypt: false, contentType: "text/calendar" }).then(f => {
                        console.log("public calendar at ", f)
                    }, error => {
                        console.log("error publish event", error)
                    })
                } else {
                    console.log("error creating ics", error)
                }
            } catch (e) {
                console.log("e", e)
            }
        })
}

function formatEvents(events) {
    var icsEvents = []
    for (var i in events) {
        const event = events[i]
        const ical = {}
        ical.title = event.title
        ical.description = event.description
        ical.start = dateToArray(event, new Date(event.start));
        ical.end = dateToArray(event, new Date(event.end));
        ical.uid = event.uuid
        icsEvents.push(ical)
    }
    console.log(icsEvents)
    return icsEvents
}

function dateToArray(event, date) {
    if (event.allDay) {
        return [date.getFullYear(), date.getMonth() + 1, date.getDay()];
    }
    else {
        return [date.getFullYear(), date.getMonth() + 1, date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds()];
    }
}
