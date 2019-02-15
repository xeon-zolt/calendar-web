import React, { Component } from 'react'
import { Nav } from 'react-bootstrap'

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
        this.props.showSettings()
        this.setState({ activeKey: 'settings' })
        break
      case 'publicCalendar':
        this.props.showMyPublicCalendar('public@' + this.props.username)
        this.setState({ activeKey: 'publicCalendar' })
        break
      case 'all':
        this.props.showAllEvents()
        this.setState({ activeKey: 'all' })
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
        <div style={{ margin: '4px' }}>
          <Nav
            variant="pills"
            onSelect={onSelect}
            activeKey={activeKey}
            justify
          >
            <Nav.Item>
              <Nav.Link eventKey="all">My Events</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="publicCalendar" disabled={!hasPublicCalendar}>
                My Public Calendar
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="settings">Settings</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      )
    )
  }
}
