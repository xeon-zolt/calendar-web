import React from 'react'
import { Card, Container, Row, Col } from 'react-bootstrap'

const FAQ = props => {
	return (
		<Col xs={12} md={6}>
			<div style={{ fontWeight: 'bold' }}>{props.q}</div>
			<div>{props.children}</div>
		</Col>
	)
}
const FAQs = () => (
	<Card style={{ marginTop: 10 }}>
		<Card.Header>
			<h2>Frequently Asked Questions</h2>
		</Card.Header>
		<Card.Body>
			<Container fluid style={{ textAlign: 'left' }}>
				<Row>
					<FAQ q={'How is this calendar different from other cloud calendars?'}>
						OI Calendar keeps your data private to you! We, OpenIntents, do not
						store or share any user data or analytics. All data generated is
						stored in each users' own storage buckets, called Gaia Hubs. You as
						a user have control over your own hub with your Blockstack id.
						<br />
						<img width="200px" src="images/differences.gif" alt="Differences" />
					</FAQ>
					<FAQ q={'Why not login with Facebook or Google? Or my email?'}>
						Most social media companies are providing you with a free account so
						that they can sell your information to the highest bidder.
						Blockstack is different. With Blockstack, YOU control your identity.
						Neither Blockstack nor the makers of OI Calendar can take the id
						from you or have access to it.
					</FAQ>
				</Row>
				<Row>
					<FAQ q={'What is Blockstack?'}>
						Blockstack is a new approach to the internet that let you own your
						data and maintain your privacy, security and freedom. Find out more
						at{' '}
						<a href="https://docs.blockstack.org/">
							Blockstack's documentation
						</a>
					</FAQ>
					<FAQ q={'Can I trust this site?'}>
						Absolutely, but we always encourage the skeptics and the curious to
						check it out yourselves. You may view the source code{' '}
						<a href="https://github.com/openintents/calendar-web">here</a>. OI
						Calendar comes with a friendly open source license.
						<br />
						You can even host your own version of the app yourselves.
						<br />
						<a href="https://app.netlify.com/start/deploy?repository=https://github.com/openintents/calendar-web">
							<img alt="Deploy to Netlify" src="images/deploynetlify.svg" />
						</a>
					</FAQ>
				</Row>
				<Row>
					<FAQ q={'Who is OpenIntents? OI?'}>
						OpenIntents (for short OI) was founded in 2009 in Berlin, Germany.
						It started as a community effort with strong focus on open source
						and interoperability between apps. You can see more of our work in
						Android at <a href="https://openintents.org">openintents.org</a>.{' '}
						<a href="https://github.com/friedger">Friedger Müffke</a> is the
						maintainer of OpenIntents' code repositories.
					</FAQ>
					<FAQ q={'How can I contribute?'}>
						You can make monetary contributions to our{' '}
						<a href="https://opencollective.org/openintents">OpenCollective</a>{' '}
						or encourage developers by funding an issue on{' '}
						<a href="https://gitcon.co">gitcoin.co</a>.<br />
						Remember that your calendar data and identity will always be yours
						and does not depend on OpenIntents' funding.
					</FAQ>
				</Row>
				<Row>
					<FAQ q={'How does it work on Android?'}>
						On Android, you choose one calendar app from the ones already out
						there, like Business Calendar, Etar, ..., then install{' '}
						<a href="https://play.google.com/store/apps/details?id=org.openintents.calendar.sync">
							OI Calendar-Sync
						</a>
						. OI Calendar-Sync will sync your agenda from your Blockstack
						storage to the Android device (on there, in fact, to the Android
						calendar provider) and vice versa. You will find a OI Calendar-Sync
						account with your Blockstack ID in your Android settings{' '}
						<em>Accounts</em> that also shows you when the last sync took place,
						usually, every hour.
					</FAQ>
				</Row>
			</Container>
		</Card.Body>
	</Card>
)

export default FAQs
