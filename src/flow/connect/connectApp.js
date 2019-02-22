import { connect } from 'react-redux'

export default connect((state, redux) => {
  const { EventCalendar, UserProfile } = state.lazy || {}
  return {
    showPage: state.events.showPage,
    views: {
      UserProfile,
      EventCalendar,
    },
  }
})
