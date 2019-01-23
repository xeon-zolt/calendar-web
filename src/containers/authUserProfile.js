import React from 'react';
import BlockstackSignInButton from './authSignInButton'

import { connect } from 'react-redux'
import { SignUserIn, SignUserOut} from '../store/authAction'

import PropTypes from 'prop-types';

const UserProfile = (props) => {
  const {
    isSignedIn,
    isConnecting,
    name,
    avatarUrl,
    message
  } = props;

  if (isSignedIn) {
    const image = (<img src={avatarUrl} alt={name} className="authUserProfile-Avatar"/>)
    return (
      <div className="authUserProfile-Root">          
      <BlockstackSignInButton
        signIn = {props.userSignIn}
        signOut = {props.userSignOut}
        isSignedIn = {props.isSignedIn}
        img = {image}
        includeBlockstackLogo = {false}
      />
      </div>
    )
  }
  if (isConnecting) {
    return (
      <div>
      {message}
      </div>
    );
  }
  return (
    <BlockstackSignInButton
      signIn = {props.userSignIn}
      signOut = {props.userSignOut}
      isSignedIn = {props.isSignedIn}
    />
  );
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

const mapStateToProps = (state) => {
  const user = state.auth.user;
  const profile = user != null ? state.auth.user.profile : null;
  return {
    isSignedIn: user != null,
    isConnecting: user == null && state.auth.userMessage === 'Connecting',
    name: profile != null ? profile.name : null,
    avatarUrl: profile != null && "image" in profile && profile.image.length > 0 ? profile.image[0].contentUrl : null,
    message:  state.auth.userMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userSignIn: () => dispatch(SignUserIn()),
    userSignOut: () => dispatch(SignUserOut())
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (UserProfile);
