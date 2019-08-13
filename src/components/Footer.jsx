import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Footer = () => {
	return (
		<footer>
			<hr />
			<Container style={{ textAlign: 'left' }}>
				<Row>
					<Col>
						<FontAwesomeIcon icon="file-code" size="sm" /> About
						<br />
						<a
							href="https://openintents.org"
							target="_blank"
							rel="noopener noreferrer"
						>
							OpenIntents
						</a>
						<br />
						<a
							href="https://github.com/openintents/calendar-web"
							target="_blank"
							rel="noopener noreferrer"
						>
							Source&nbsp;Code
						</a>
						<br />
						<a href="/terms" target="_blank" rel="noopener noreferrer">
							Terms
						</a>
						<br />
						&copy; {new Date().getFullYear().toString()} | v
						{process.env.REACT_APP_VERSION}
					</Col>
					<Col>
						<FontAwesomeIcon icon="question" /> Support <br />
						<a
							href="https://www.producthunt.com/posts/oi-calendar"
							target="_blank"
							rel="noopener noreferrer"
						>
							ProductHunt
						</a>
						<br />
						<a
							href="https://app.dmail.online/compose?to=openintents.id&subject=OI%20Calendar"
							target="_blank"
							rel="noopener noreferrer"
						>
							Dmail
						</a>
						<br />
						<a
							href="http://www.openintents.org/contact/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Email&nbsp;Form
						</a>
						<br />
						<a
							href="https://github.com/openintents/calendar-web/#app-developers"
							target="_blank"
							rel="noopener noreferrer"
						>
							Developers
						</a>
						<br />
						<a
							href="https://github.com/openintents/calendar-web/issues?q=is%3Aissue+is%3Aopen+label%3Abug"
							target="_blank"
							rel="noopener noreferrer"
						>
							Known&nbsp;Issues
						</a>
					</Col>
					<Col>
						<FontAwesomeIcon icon="hand-holding-heart" size="sm" /> Love OI
						apps?
						<br />
						<a
							href="https://opencollective.com/openintents/donate"
							target="_blank"
							rel="noopener noreferrer"
						>
							Open&nbsp;Collective&nbsp;OpenIntents
						</a>
						<br />
						<a
							href="https://bitpatron.co/friedger.id"
							target="_blank"
							rel="noopener noreferrer"
						>
							BitPatron
						</a>
					</Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Footer
