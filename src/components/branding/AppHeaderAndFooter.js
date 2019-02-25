import React from 'react'
import PropTypes from 'prop-types'
import { Nav, Navbar, Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const AppHeader = props => {
  const { ConnectedAppMenu, UserProfile } = props

  return (
    <Navbar bg="light" expand="lg" variant="light">
      <Navbar.Brand>
        <a href="/">
          <img
            className="App-logo"
            src="/android-chrome-192x192.png"
            alt="OI Calendar Logo"
          />
        </a>
        OI Calendar
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <ConnectedAppMenu />
          {UserProfile && <UserProfile />}
        </Nav>
      </Navbar.Collapse>
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
      <Container style={{ textAlign: 'left' }}>
        <Row>
          <Col>
            <FontAwesomeIcon icon="file-code" size="sm" /> Developed By{' '}
            <a href="https://openintents.org">OpenIntents</a>, free and{' '}
            <a href="https://github.com/friedger/oi-calendar">open source</a>,
            based on work by{' '}
            <a href="https://github.com/yasnaraj/react-calendar-events-example">
              Yasna R.
            </a>{' '}
            | {new Date().getFullYear().toString()} | v
            {process.env.REACT_APP_VERSION}
          </Col>
          <Col>
            <FontAwesomeIcon icon="question" /> Support <br />
            <a href="http://www.openintents.org/contact/">Send Feedback</a>
            <br />
            <a href="https://github.com/friedger/oi-calendar/issues?q=is%3Aissue+is%3Aopen+label%3Abug">
              {' '}
              Known Issues
            </a>
          </Col>
          <Col>
            <FontAwesomeIcon icon="hand-holding-heart" size="sm" /> Love OI
            apps? You can now donate to our open collective:
            <br />
            <a href="https://opencollective.com/openintents/donate">
              https://opencollective.com/openintents/donate
            </a>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export { AppHeader, AppFooter }
