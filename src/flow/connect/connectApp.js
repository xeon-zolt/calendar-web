import { connect } from 'react-redux'

export default connect((state, redux) => {
  const { EventCalendar, UserProfile } = state.lazy || {}
  return {
    showSettings: state.events.showSettings,
    views: {
      UserProfile,
      EventCalendar,
    },
  }
})
