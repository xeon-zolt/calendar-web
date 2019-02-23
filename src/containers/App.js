import { connect } from 'react-redux'

export default connect((state, redux) => {
  const { Calendar, UserProfile } = state.lazy || {}
  return {
    showPage: state.events.showPage,
    views: {
      UserProfile,
      Calendar,
    },
  }
})
