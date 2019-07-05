import React, { Component } from 'react'
import { Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
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
			case 'rate':
				break
			default:
				console.warn('invalid menu item ', eventKey)
				break
		}
	}

	isRoot(match, location) {
		if (!match) {
			return false
		}
		return match.isExact
	}

	render() {
		const { onSelect } = this.bound
		const { username, signedIn } = this.props
		const hasPublicCalendar = !!username

		return (
			signedIn && (
				<div className="App-menu">
					<Nav
						variant="pills"
						activeKey={this.state.activeKey}
						onSelect={onSelect}
					>
						<Nav.Item>
							<Nav.Link
								eventKey="all"
								as={NavLink}
								isActive={this.isRoot}
								to={{ pathname: '/' }}
								exact
							>
								Events
							</Nav.Link>
						</Nav.Item>
						<Nav.Item hidden>
							<Nav.Link
								eventKey="public"
								as={NavLink}
								disabled={!hasPublicCalendar}
								to={{
									pathname: '/public',
									search: `?c=public@${username}`,
								}}
							>
								Public
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="settings" as={NavLink} to="settings">
								Settings
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link
								eventKey="rate"
								as={NavLink}
								to="rate"
								isActive={false}
								onClick={e => {
									e.preventDefault()
									window.open(
										'https://app-center.openintents.org/appco/1062/comment'
									)
								}}
							>
								Rate App!
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="files" as={NavLink} to="files">
								Files
							</Nav.Link>
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
