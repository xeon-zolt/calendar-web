import React, { Component } from 'react'
import {
  Button,
  Glyphicon,
  Panel,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'

class AddDeleteSetting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      valueOfAdd: props.valueOfAdd || '',
      showFollow: false,
    }
    this.bound = [
      'renderItem',
      'onAddValueChange',
      'onAddItem',
      'onDeleteItem',
      'onChangeItem',
      'onFollowItem',
      'onUnfollowItem',
    ].reduce((acc, d) => {
      acc[d] = this[d].bind(this)
      return acc
    }, {})
  }

  onAddValueChange(event) {
    const valueOfAdd = event.target.value
    this.setState({ valueOfAdd })
  }

  onAddItem(event) {
    const { valueOfAdd, addValueToItem } = this.state
    const { addItem } = this.props
    addValueToItem(valueOfAdd, ({ item, error }) => {
      if (error) {
        this.setState({
          valueOfAdd,
          errorOfAdd: (error || '').toString(),
        })
      } else {
        addItem(item)
        this.setState({ valueOfAdd: '', errorOfAdd: '' })
      }
    })
  }

  onDeleteItem(event) {
    const { items: itemList, deleteItems } = this.props
    const { idx } = event.target.dataset
    const item = itemList[idx]
    deleteItems([item])
  }

  onChangeItem(item, data) {
    const { setItemData } = this.props
    setItemData(item, data)
  }

  onFollowItem(event) {
    const { items, followItem } = this.props
    const { idx } = event.target.dataset
    const item = items[idx]
    followItem(item)
  }

  onUnfollowItem(event) {
    const { items, unfollowItem } = this.props
    const { idx } = event.target.dataset
    const item = items[idx]
    unfollowItem(item)
  }

  renderUnFollowButton(follows, i, username) {
    const { onUnfollowItem, onFollowItem } = this.bound
    if (follows) {
      const tip = 'Remove ' + username + "'s public calendar"
      const tooltip = <Tooltip id="tooltip">{tip}</Tooltip>
      return (
        <OverlayTrigger placement="left" overlay={tooltip}>
          <div style={{ display: 'inline-block', margin: '16px' }}>
            <Glyphicon
              glyph="minus-sign"
              onClick={onUnfollowItem}
              data-idx={i}
            />
          </div>
        </OverlayTrigger>
      )
    } else {
      const tip = 'Add ' + username + "'s public calendar"
      const tooltip = <Tooltip id="tooltip">{tip}</Tooltip>
      return (
        <OverlayTrigger placement="left" overlay={tooltip}>
          <div style={{ display: 'inline-block', margin: '16px' }}>
            <Glyphicon glyph="plus-sign" onClick={onFollowItem} data-idx={i} />
          </div>
        </OverlayTrigger>
      )
    }
  }

  renderItem(d, i, user, calendars) {
    const { ItemRenderer, showFollow } = this.state
    const { onChangeItem, onDeleteItem } = this.bound
    const follows =
      showFollow &&
      !!calendars.find(
        c => c.type === 'blockstack-user' && c.data.user === d.username
      )
    const showDelete = d.name !== 'default' || d.type !== 'private'
    return (
      <div key={i} className="d-inline-block">
        <div style={{ display: 'inline-block', width: '80%' }}>
          {ItemRenderer && (
            <ItemRenderer
              item={d}
              idx={i}
              onChangeItem={onChangeItem}
              user={user}
            />
          )}
        </div>
        {showFollow && this.renderUnFollowButton(follows, i, d.username)}
        {showDelete && (
          <div style={{ display: 'inline-block', margin: '16px' }}>
            <Glyphicon glyph="trash" onClick={onDeleteItem} data-idx={i} />
          </div>
        )}
      </div>
    )
  }

  render() {
    const { items: itemList, user, calendars } = this.props
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
            {renderAdd()}
            <Button
              onClick={onAddItem}
              disabled={!valueOfAdd}
              style={{ margin: 8 }}
            >
              Add
            </Button>
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

/*
 */

export default AddDeleteSetting
