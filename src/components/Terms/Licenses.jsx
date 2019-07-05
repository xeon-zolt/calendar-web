import React from 'react'
import { Card, Container, Row, Col } from 'react-bootstrap'

const License = props => {
	return (
		<Col xs={12} md={6}>
			<div style={{ fontWeight: 'bold' }}>{props.name}</div>
			<div>{props.children}</div>
		</Col>
	)
}
const Licenses = () => (
	<Card style={{ marginTop: 10 }}>
		<Card.Header>
			<h2>Open Source Licenses</h2>
			This software may contain portions of the following libraries, subject to
			the below licenses.
		</Card.Header>
		<Card.Body>
			<Container fluid style={{ textAlign: 'left' }}>
				<Row>
					<License name={'react-calendar-events-example'}>
						This project started with a fork of work by{' '}
						<a href="https://github.com/yasnaraj/react-calendar-events-example">
							Yasna R.
						</a>
					</License>
					<License name={'react'}>MIT License</License>
				</Row>
			</Container>
		</Card.Body>
	</Card>
)

export default Licenses
