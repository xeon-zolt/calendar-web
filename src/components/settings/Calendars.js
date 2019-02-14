import React, { Component } from 'react'
import AddDeleteSetting from './AddDeleteSetting'
import { uuid, guaranteeHexColor } from '../../flow/io/eventFN'
import {
  Button,
  Panel,
  Row,
  Col,
  DropdownButton,
  MenuItem,
  Alert,
  // Alert,
} from 'react-bootstrap'

class CalendarItem extends Component {
  constructor(props) {
    super(props)
    const { type, name, disabled, hexColor } = props.item || {}
    const isPrivateDefault = type === 'private' && name === 'default'
    this.state = {
      disabled: disabled || false,
      hexColor: hexColor || '#000000',
      isPrivateDefault,
    }
    this.bound = {
      onColorChange: this.onColorChange.bind(this),
      onVisibilityChange: this.onVisibilityChange.bind(this),
    }
  }

  onVisibilityChange(event) {
    const checked = event.target.checked
    const { item: calendar, idx, onChangeItem } = this.props
    onChangeItem(calendar, { disabled: !checked }, idx)
    this.setState({ disabled: !checked })
  }

  onColorChange(event) {
    const hexColor = event.target.value
    console.log('onColorChange', event.target.value)
    const { item: calendar, idx, onChangeItem } = this.props
    onChangeItem(calendar, { hexColor }, idx)
    this.setState({ hexColor })
  }

  render() {
    const { item: calendar, user } = this.props || {}
    const { hexColor, disabled, isPrivateDefault } = this.state
    const { onColorChange, onVisibilityChange } = this.bound
    var name = (calendar || {}).name
    if (isPrivateDefault) {
      name = 'Your private calendar (' + user.username + ')'
    }
    return (
      <div>
        <input
          type="checkbox"
          checked={!disabled}
          onChange={onVisibilityChange}
        />
        <input
          type="color"
          value={hexColor}
          onChange={onColorChange}
          style={{ marginRight: '20px', marginLeft: '5px' }}
        />

        <label>{name}</label>
        {/* TODO implement editCalendar
        {privateCalendar && (
          <Button variant="light">
            <span className="glyphicon glyphicon-pencil" />
          </Button>
        )}
        */}
      </div>
    )
  }
}

export default class Calendars extends AddDeleteSetting {
  constructor(props) {
    super(props)
    const addPlaceholder = 'e.g. https://calendar.google..../basic.ics'
    this.state.ItemRenderer = CalendarItem
    this.state.addTitle = 'Add Calendar from url'
    this.state.listTitle = 'Calendars'
    this.state.calendarName = ''
    this.state.calendarEvents = 0
    this.state.showFollow = false
    this.state.hexColor = ''
    this.state.isVerified = false
    this.state.menuItems = [
      // 'https://5c609074a2c02d0007d39068--upbeat-wing-158214.netlify.com/?intent=view&name=public%40friedger.id',
      'https://calendar.google.com/calendar/ical/en.usa%23holiday%40group.v.calendar.google.com/public/basic.ics',
    ]
    this.state.addValueToItem = (valueOfAdd, asyncReturn) => {
      let newItem

      let errors = []

      const { items } = this.props
      const names = items.map(d => {
        return d.name
      })
      if (names.includes(valueOfAdd)) {
        errors.push('Calendar already included')
      }

      if (valueOfAdd) {
        if (valueOfAdd.startsWith('http')) {
          newItem = {
            type: 'ics',
            data: { src: valueOfAdd },
          }
        } else {
          const [src, user, more] = valueOfAdd.split('@')
          if (src && user && !more) {
            newItem = {
              type: 'blockstack-user',
              data: { user, src: src + '/AllEvents' },
            }
          } else {
            errors.push('Invalid calendar ')
          }
        }
      }
      if (newItem) {
        const { type, data } = newItem
        newItem = {
          uid: uuid(),
          type,
          name: this.state.calendarName || valueOfAdd,
          hexColor: this.state.hexColor || null,
          mode: 'read-only',
          data,
        }
      }

      asyncReturn({
        item: newItem,
        error: (errors || []).join(' '),
      })
    }

    this.state.renderAdd = () => {
      return (
        <input
          placeholder={addPlaceholder}
          type="text"
          value={this.state.valueOfAdd}
          onChange={this.bound2.onAddValueChange}
          style={{ width: '80%' }}
        />
      )
    }

    this.bound2 = ['onAddValueChange'].reduce((acc, d) => {
      acc[d] = this[d].bind(this)
      delete this[d]
      return acc
    }, {})
  }

  handleSelect = (eventKey, event) => {
    this.setState({ valueOfAdd: this.state.menuItems[eventKey] })
  }

  renderOrSeparator = () => (
    <Row style={{ padding: '5px' }}>
      <Col sm={12} style={{ textAlign: 'center' }}>
        or
      </Col>
    </Row>
  )

  handleVerifyButton = () => {
    const { verifyAddCalendar } = this.props
    const { valueOfAdd, addValueToItem } = this.state

    this.setState({
      hexColor: guaranteeHexColor(null),
    })

    addValueToItem(valueOfAdd, ({ item, error }) => {
      if (error) {
        this.setState({
          valueOfAdd,
          errorOfAdd: (error || '').toString(),
        })
      } else {
        verifyAddCalendar(item)
      }
    })
  }

  handleCalendarNameChange = event => {
    this.setState({ calendarName: event.target.value })
  }

  onColorChange = event => {
    const hexColor = event.target.value
    console.log('onColorChange', event.target.value)
    this.setState({ hexColor })
  }

  render() {
    const {
      items: itemList,
      user,
      calendars,
      verifiedNewCalendarData,
    } = this.props
    const { renderItem, onAddItem } = this.bound
    const {
      valueOfAdd,
      addTitle,
      listTitle,
      renderAdd,
      errorOfAdd,
    } = this.state

    return (
      <div className="settings">
        <Panel style={{ width: '80%' }}>
          <Panel.Heading>{addTitle}</Panel.Heading>
          <Panel.Body>
            <Row>
              <Col md={6} sm={12}>
                <Row style={{ padding: '5px' }}>
                  {renderAdd()}{' '}
                  <Button
                    onClick={this.handleVerifyButton}
                    disabled={!valueOfAdd}
                  >
                    Verify
                  </Button>
                </Row>
                {this.renderOrSeparator()}
                <Row style={{ padding: '5px' }}>
                  <Col sm={12} style={{ textAlign: 'center' }}>
                    <Button disabled>Upload file...</Button>
                  </Col>
                </Row>
                {this.renderOrSeparator()}
                <Row style={{ padding: '5px' }}>
                  <Col sm={12} style={{ textAlign: 'center' }}>
                    <DropdownButton
                      title="Choose from list..."
                      id="document-type"
                      onSelect={this.handleSelect}
                    >
                      {this.state.menuItems.map((opt, i) => (
                        <MenuItem key={i} eventKey={i}>
                          {opt}
                        </MenuItem>
                      ))}
                    </DropdownButton>
                  </Col>
                </Row>
              </Col>
              <Col md={6} sm={12}>
                <Row style={{ padding: '5px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Calendar name"
                    onChange={this.handleCalendarNameChange}
                    disabled={verifiedNewCalendarData.status !== 'ok'}
                  />
                </Row>
                <Row style={{ padding: '5px' }}>
                  <Col sm={12} style={{ textAlign: 'center' }}>
                    <input
                      type="color"
                      value={this.state.hexColor}
                      onChange={this.onColorChange}
                      style={{
                        marginRight: '20px',
                        marginLeft: '5px',
                        width: '50%',
                        height: '44px',
                      }}
                      disabled={verifiedNewCalendarData.status !== 'ok'}
                    />
                  </Col>
                </Row>
                <Row style={{ padding: '5px' }}>
                  <Col sm={12} style={{ textAlign: 'center' }}>
                    <Alert style={{ marginBottom: '0px' }}>
                      Calendar{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {this.state.calendarName}
                      </span>{' '}
                      has{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {verifiedNewCalendarData.eventsCount}
                      </span>{' '}
                      events
                    </Alert>
                  </Col>
                </Row>

                <Row style={{ padding: '5px' }}>
                  <Col sm={12} style={{ textAlign: 'center' }}>
                    <Button
                      onClick={onAddItem}
                      disabled={
                        !valueOfAdd || verifiedNewCalendarData.status !== 'ok'
                      }
                      style={{ margin: 8 }}
                    >
                      Add Calendar
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <span style={{ paddingLeft: 16 }}>{errorOfAdd}</span>
          </Panel.Body>
        </Panel>

        <Panel style={{ width: '80%' }}>
          <Panel.Heading>{listTitle}</Panel.Heading>
          <Panel.Body>
            <div>
              {(itemList || []).map((v, k) =>
                renderItem(v, k, user, calendars)
              )}
            </div>
          </Panel.Body>
        </Panel>
      </div>
    )
  }
}
