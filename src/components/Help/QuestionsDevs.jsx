import React from 'react'
import { Card, Container, Row } from 'react-bootstrap'
import { FAQ } from '../FAQ'

const QuestionsWeb = () => (
	<Card style={{ marginTop: 10 }}>
		<Card.Header>
			<h2>FAQ for Developers</h2>
		</Card.Header>
		<Card.Body>
			<Container fluid style={{ textAlign: 'left' }}>
				<Row>
					<FAQ q={'How to add a new calendar event from my app?'}>
						Add a button with a link to
						"https://cal.openintents.org/?intent=addevent" and add query
						parameters for
						<ul>
							<li>
								<em>start</em> Start date in a format that can be parsed by
								Date.
							</li>
							<li>
								<em>end</em> End date in a format that can be parsed by Date.
							</li>
							<li>
								<em>title</em> The title of the event.
							</li>
							<li>
								<em>via</em> A blockstack ID that will be added as guest.
							</li>
						</ul>
					</FAQ>
					<FAQ
						q={
							'How to let users subscribe to a calendar (ics url) relevant for my app?'
						}
					>
						Add a button with a link to
						"https://cal.openintents.org/?intent=addics" and add query
						parameters for
						<ul>
							<li>
								<em>url</em> The url to the calendar feed.
							</li>
						</ul>
					</FAQ>
				</Row>
			</Container>
		</Card.Body>
	</Card>
)

export default QuestionsWeb
