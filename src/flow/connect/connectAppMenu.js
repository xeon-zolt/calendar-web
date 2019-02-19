import { connect } from 'react-redux'
import { showSettings } from '../store/event/calendarActionLazy'
import {
  showMyPublicCalendar,
  showAllCalendars,
} from '../store/event/eventActionLazy'
import { showFiles } from '../store/gaia/filesAction'
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

    var page = events.showPage
    if (!page) {
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
      showFiles: () => {
        dispatch(showFiles())
      },
    }
  }
)
