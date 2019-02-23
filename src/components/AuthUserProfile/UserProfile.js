import React from 'react'
import PropTypes from 'prop-types'
import BlockstackSignInButton from './SignInButton'

const UserProfile = props => {
  const { isSignedIn, isConnecting, name, avatarUrl, message } = props

  if (isSignedIn) {
    const image = (
      <img src={avatarUrl} alt={name} className="authUserProfile-Avatar" />
    )
    return (
      <div className="authUserProfile-Root">
        <BlockstackSignInButton
          signIn={props.userSignIn}
          signOut={props.userSignOut}
          isSignedIn={props.isSignedIn}
          img={image}
          includeBlockstackLogo={false}
        />
      </div>
    )
  }
  if (isConnecting) {
    return <div>{message}</div>
  }
  return (
    <div className="authUserProfile-Root">
      <BlockstackSignInButton
        signIn={props.userSignIn}
        signOut={props.userSignOut}
        isSignedIn={props.isSignedIn}
      />
    </div>
  )
}

UserProfile.propTypes = {
  isSignedIn: PropTypes.bool,
  isConnecting: PropTypes.bool,
  name: PropTypes.string,
  avatarUrl: PropTypes.string,
  message: PropTypes.string,
  userSignIn: PropTypes.func,
  userSignOut: PropTypes.func,
}

export default UserProfile
