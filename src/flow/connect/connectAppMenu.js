import { connect } from 'react-redux'
import { showSettings } from '../store/event/calendarActionLazy'
import {
  showMyPublicCalendar,
  showAllCalendars,
} from '../store/event/eventActionLazy'
import { setCurrentEvent } from '../store/event/eventAction'

export default connect(
  (state, redux) => {
    const { events, auth } = state
    const { user } = auth
    var username = null
    var signedIn = false

    if (user) {
      username = user.username
      signedIn = true
    }

    var page
    if (events.showSettings) {
      page = 'settings'
    } else if (events.myPublicCalendarIcsUrl || events.publicCalendarEvents) {
      page = 'publicCalendar'
    } else {
      page = 'all'
    }
    return { username, signedIn, page }
  },
  dispatch => {
    return {
      showSettings: () => {
        dispatch(showSettings())
      },
      showMyPublicCalendar: name => {
        dispatch(setCurrentEvent)
        dispatch(showMyPublicCalendar(name))
      },
      showAllEvents: () => {
        dispatch(showAllCalendars())
      },
    }
  }
)
