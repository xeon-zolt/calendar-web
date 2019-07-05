import { connect } from 'react-redux'
import Help from '../components/Help'

const mapStateToProps = state => {
  return {
    user: state.auth.user,
  }
}

const HelpContainer = connect(mapStateToProps)(Help)

export default HelpContainer
