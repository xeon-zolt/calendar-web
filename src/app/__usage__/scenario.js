import React, { Component } from 'react'

import App from '../DynamicApp'
// import ReudxApp from "../redux-app";
// import ConnectedCalendar from "../redux-calendar";
// import ConnectedEventDetails from "../redux-event-details";
// import ConnectedUserProfile from "../redux-user-profile";
// import ConnectedGuestList from "../redux-guest-list";

// import EventDetails from "../../components/event-details/EventDetails";
// import { LoadGuestList, SendInvites } from "../../store/event/eventActionLazy";

// import moment from "moment";
// import * as blockstack from "blockstack";
// import * as ics from "ics";
// import * as ICAL from "ical.js";

const doNothing = () => {}

let Calendar = props => {
  return <div>Calendar</div>
}
let UserProfile = props => {
  return <div>UserProfile</div>
}

let whenAppLoaded = forceUpdate => {
  console.log('whenAppLoaded')
  import('../../components/Calendar').then(({ default: CalendarBase }) => {
    Calendar = props => {
      return (
        <CalendarBase
          getInitialEvents={doNothing}
          views={{ EventDetails: doNothing }}
          events={{ allEvents: {} }}
        />
      )
    }
    console.log('CalendarLoaded')
    forceUpdate()
  })

  import('../../components/AuthUserProfile/UserProfile').then(
    ({ default: UserProfileBase }) => {
      UserProfile = props => {
        return (
          <UserProfileBase
            isSignedIn
            isConnecting
            userSignOut={doNothing}
            userSignIn={doNothing}
          />
        )
      }
      console.log('CalendarLoaded')
      // forceUpdate();
    }
  )
}

let dynamicApp

class DynamicApp extends Component {
  render() {
    return <App views={{ Calendar, UserProfile }} />
  }
  doSomething() {}
  componentDidMount() {
    whenAppLoaded(() => {
      console.log('DONE')
      this.forceUpdate()
    })
  }
}

const Scenario = () => {
  dynamicApp = <DynamicApp />
  return dynamicApp
}

export default Scenario
