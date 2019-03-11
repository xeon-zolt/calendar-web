import { connect } from 'react-redux'

// Components
import AppMenu from '../components/AppMenu'

// Actions
import { showSettings } from '../store/event/calendarActionLazy'
import {
  showMyPublicCalendar,
  showAllCalendars,
} from '../store/event/eventActionLazy'
import { showFiles } from '../store/gaia/actions'

const mapStateToProps = state => {
  const { events, auth } = state
  const { user } = auth
  let username = null
  let signedIn = false

  if (user) {
    username = user.username
    signedIn = true
  }

  let page = events.showPage
  if (!page) {
    page = 'all'
  }

  return { username, signedIn, page }
}

const mapDispatchToProps = dispatch => {
  return {
    showSettings: () => {
      dispatch(showSettings())
    },
    showMyPublicCalendar: name => {
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

const AppMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppMenu)

export default AppMenuContainer
