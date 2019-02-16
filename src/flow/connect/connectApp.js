import { connect } from 'react-redux'

export default connect((state, redux) => {
  const { EventCalendar, UserProfile } = state.lazy || {}
  return {
    showSettings: state.events.showSettings,
    showFiles: state.events.showFiles,
    files: state.gaia.files,
    views: {
      UserProfile,
      EventCalendar,
    },
  }
})
