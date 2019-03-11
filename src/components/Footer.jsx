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
						Join the conversation on{' '}
						<a href="https://www.producthunt.com/posts/oi-calendar">
							ProductHunt
						</a>
						<br />
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
		</footer>
	)
}

export default Footer
