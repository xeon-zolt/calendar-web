import * as types from './eventActionTypes'
import * as authTypes from './authActionTypes'
import moment from 'moment';
import * as blockstack from "blockstack";

export function SendInvites(eventInfo) {
    return async (dispatch, getState) => {
        handleGuests(getState(), eventInfo).then(({ eventInfo, contacts }) => {
            dispatch({
                type: types.INVITES_SENT
            })
        })
    }
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
            var promise = Promise.resolve({ contacts, eventInfo })

            for (var i in guests) {
                const guest = guests[i]
                if (guest && guest.length > 0) {
                    promise = promise.then(({ contacts, eventInfo }) => {
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
            return promise.then(({contacts, eventInfo}) => {
                console.log("contacts", contacts)
                return blockstack.putFile("Contacts", JSON.stringify(contacts))
                    .then(() => {
                        return { contacts, eventInfo }
                    })
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
        contacts[guest] = {}
        roomPromise = state.events.userSessionChat.createNewRoom("Events with " + state.events.user.username, "Invitations, Updates,..")
    }

    console.log("check before room promise", eventInfo, contacts)
    return roomPromise.then(
        roomResult => {
            console.log("check after room", eventInfo, contacts)

            var roomId = roomResult.room_id
            Object.assign(contacts[guest], { roomId })
            console.log("check after assign", eventInfo, contacts)

            return sendInviteMessage(guest, state.userSessionChat, roomId, eventInfo.eventName, eventInfo.readUrl)
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
            console.log("check on room failure", eventInfo, contacts)
            return { contacts, eventInfo }
        }
    )
}

function sendInviteMessage(guest, userSessionChat, roomId, eventName, readUrl) {
    return userSessionChat.sendMessage(guest, roomId, {
        msgtype: "m.text",
        body: "You are invited to " + eventName,
        format: "org.matrix.custom.html",
        formatted_body: "You are invited to <a href=\"" + readUrl + "\">" + eventName + "</a>"
    })
}

export function GetInitialEvents(query) {
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
            dispatch({ type: authTypes.AUTH_DISCONNECTED})
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