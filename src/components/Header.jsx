import React, { memo } from 'react'
import { Nav, Navbar } from 'react-bootstrap'

// Containers
import AppMenuContainer from '../containers/AppMenu'
import UserProfileContainer from '../containers/UserProfile'

const Header = () => {
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
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="ml-auto">
						<AppMenuContainer />
						<UserProfileContainer />
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</header>
	)
}

export default memo(Header)
