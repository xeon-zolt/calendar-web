import React from 'react'
import PropTypes from 'prop-types'
import { Nav, Navbar } from 'react-bootstrap'

const AppHeader = props => {
  const { ConnectedAppMenu, UserProfile } = props

  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand>
        <img
          className="App-logo"
          src="/android-chrome-192x192.png"
          alt="OI Calendar Logo"
        />
        OI Calendar
      </Navbar.Brand>
      <Nav className="ml-auto">
        <ConnectedAppMenu />
        {UserProfile && <UserProfile />}
      </Nav>
    </Navbar>
  )
}

AppHeader.propTypes = {
  ConnectedAppMenu: PropTypes.func,
  UserProfile: PropTypes.func,
}

const AppFooter = () => {
  return (
    <>
      <hr />
      <p>
        Developed By <a href="https://openintents.org">OpenIntents</a>, free and{' '}
        <a href="https://github.com/friedger/oi-calendar">open source</a>, based
        on work by{' '}
        <a href="https://github.com/yasnaraj/react-calendar-events-example">
          Yasna R.
        </a>{' '}
        | {new Date().getFullYear().toString()} | v
        {process.env.REACT_APP_VERSION}
      </p>
      <p>
        Love OI apps? You can now donate to our open collective:
        <br />
        <a href="https://opencollective.com/openintents/donate">
          https://opencollective.com/openintents/donate
        </a>
      </p>
    </>
  )
}

export { AppHeader, AppFooter }
