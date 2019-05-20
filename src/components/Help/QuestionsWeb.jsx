import React from 'react'
import { Card, Container, Row } from 'react-bootstrap'
import { FAQ } from '../FAQ'

const QuestionsWeb = () => (
	<Card style={{ marginTop: 10 }}>
		<Card.Header>
			<h2>FAQ Web app</h2>
		</Card.Header>
		<Card.Body>
			<Container fluid style={{ textAlign: 'left' }}>
				<Row>
					<FAQ q={'What are Enriched Notifications?'}>
						In Settings, you can enabled enriched notifications. With this
						settings, the app will send you a message currently using matrix.org
						via the OI Chat matrix server, if the app is still running at the
						time when the notification should be sent.
						<br />
						The message will contain details about the invited guests of the
						relevant event. The details contain information from the SpringRole
						application if available. Please note that not all users have a
						profile on SpringRole.
						<br />
						Using OI Chat matrix server requires that you agree to their terms
						and conditions before sending the first message.
					</FAQ>
					<FAQ q={'How to send invitations to event guests?'}>
						When creating or editing an event, you can add guests by their
						blockstack id. For new events with guests, you are asked about
						invitations while saving the event, for existing events with guests,
						you can always trigger invitations with the "Send invitations"
						button.
						<br />
						Invitations are sent via the OI Chat matrix server. All sent
						messages are stored in your own storage (see "Files" menu). Using OI
						Chat matrix server requires that you agree to their terms and
						conditions before sending the first message. In the future, OI
						Calendar will lookup the preferred communication method of each
						user.
						<br />
						Guests who never used OI Chat before will see the invitation when
						they log in the first time. Current users of OI Chat, will also
						receive notifications according to their settings for invitations in
						their matrix client.
					</FAQ>
				</Row>
				<Row>
					<FAQ q={'What is the Files section'}>
						The <em>Files</em> section list all files that OI Calendar has
						created on your storage. This is your data! OpenIntents or other
						partys do not have access or a copy of this data (only if you have
						shared an event with others).
						<br />
						All files but the public event files are encrypted with your private
						key for OI Calendar. The only unencrypted files contains the list of
						public events in json and ical format.
					</FAQ>
				</Row>
			</Container>
		</Card.Body>
	</Card>
)

export default QuestionsWeb
