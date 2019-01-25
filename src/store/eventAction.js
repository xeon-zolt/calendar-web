import * as types from './eventActionTypes'
import * as authTypes from './authActionTypes'
import moment from 'moment';
import * as blockstack from "blockstack";
import * as ics from 'ics'

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

function loadCalendarData(dispatch) {
    var allEvents = [{
        id: 0,
        title: 'Today!',
        allDay: true,
        start: new Date(moment()),
        end: new Date(moment()),
        hexColor: '#265985',
        notes: 'Have a great day!'
    }];
    blockstack.getFile("AllEvents").then((allEve) => {
        if (allEve) {
            allEvents = JSON.parse(allEve);
        } else {
            blockstack.putFile("AllEvents", JSON.stringify(allEvents));
        }
        dispatch({ type: types.ALL_EVENTS, allEvents });
    });
    blockstack.getFile("Contacts").then((contacts) => {
        if (contacts == null) {
            contacts = {}
        }
        contacts = {}
        dispatch({ type: types.ALL_CONTACTS, contacts: JSON.parse(contacts) })
    });
}

export function publishEvent(event) {
    event.uuid =  uuid()
    console.log("publishEvent ", event, event.uuid)
    const publicEventPath = "public/AllEvents"
    blockstack.getFile(publicEventPath, { decrypt: false }).then(
        fileContent => {
            var publicEvents = {}
            if (fileContent !== null) {
                publicEvents = JSON.parse(fileContent)
            }
            publicEvents = {}
            publicEvents[event.uuid] = event
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
