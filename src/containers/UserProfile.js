import { connect } from 'react-redux'

// Components
import UserProfile from '../components/UserProfile'

// Actions
import { signUserIn, signUserOut } from '../store/auth/actions'

const mapStateToProps = state => {
  const user = state.auth.user
  const profile = user != null ? state.auth.user.profile : null
  return {
    isSignedIn: user != null,
    isConnecting: user == null && state.auth.userMessage === 'Connecting',
    name: profile != null ? profile.name : null,
    avatarUrl:
      profile != null && 'image' in profile && profile.image.length > 0
        ? profile.image[0].contentUrl
        : null,
    identityAddress: user != null && user.identityAddress,
    message: state.auth.userMessage,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userSignIn: () => dispatch(signUserIn()),
    userSignOut: () => dispatch(signUserOut()),
  }
}

const UserProfileContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile)

export default UserProfileContainer
