import UserProfile from "../components/auth-user-profile/UserProfile";

import { connect } from "react-redux";
import { SignUserIn, SignUserOut } from "../store/auth/authAction";

const mapStateToProps = (state, redux) => {
  const user = state.auth.user;
  const profile = user != null ? state.auth.user.profile : null;
  return {
    isSignedIn: user != null,
    isConnecting: user == null && state.auth.userMessage === "Connecting",
    name: profile != null ? profile.name : null,
    avatarUrl:
      profile != null && "image" in profile && profile.image.length > 0
        ? profile.image[0].contentUrl
        : null,
    message: state.auth.userMessage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userSignIn: () => dispatch(SignUserIn()),
    userSignOut: () => dispatch(SignUserOut())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
