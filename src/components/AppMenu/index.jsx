import React, { Component } from 'react'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'

export default class AppMenu extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeKey: props.page,
		}

		this.bound = ['onSelect'].reduce((acc, d) => {
			acc[d] = this[d].bind(this)
			return acc
		}, {})
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ activeKey: nextProps.page })
	}

	onSelect(eventKey) {
		switch (eventKey) {
			case 'settings':
				this.setState({ activeKey: 'settings' })
				break
			case 'public':
				this.setState({ activeKey: 'public' })
				break
			case 'all':
				this.setState({ activeKey: 'all' })
				break
			case 'files':
				this.setState({ activeKey: 'files' })
				break
			default:
				console.warn('invalid menu item ', eventKey)
				break
		}
	}

	render() {
		const { onSelect } = this.bound
		const { username, signedIn } = this.props
		const { activeKey } = this.state
		const hasPublicCalendar = !!username

		return (
			signedIn && (
				<div className="App-menu">
					<Nav variant="pills" onSelect={onSelect} activeKey={activeKey}>
						<Nav.Item>
							<Link to="/">Events</Link>
						</Nav.Item>
						<Nav.Item>
							<Link
								disabled={!hasPublicCalendar}
								to={{
									pathname: '/public',
									search: `?c=public@${username}`,
								}}
							>
								Public
							</Link>
						</Nav.Item>
						<Nav.Item>
							<Link to="settings">Settings</Link>
						</Nav.Item>
						<Nav.Item>
							<Link to="files">Files</Link>
						</Nav.Item>
					</Nav>
				</div>
			)
		)
	}
}

AppMenu.propTypes = {
	username: PropTypes.string,
	signedIn: PropTypes.bool.isRequired,
}
