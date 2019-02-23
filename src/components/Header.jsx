import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import PropTypes from 'prop-types'

const Header = props => {
  const { ConnectedAppMenu, UserProfile } = props

  return (
    <header className="App-header">
      <Navbar bg="light" expand="lg" variant="light">
        <Navbar.Brand>
          <img
            className="App-logo"
            src="/android-chrome-192x192.png"
            alt="OI Calendar Logo"
          />
          OI Calendar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <ConnectedAppMenu/>
            {UserProfile && <UserProfile/>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}

Header.propTypes = {
  ConnectedAppMenu: PropTypes.func,
  UserProfile: PropTypes.func,
}

export default Header
