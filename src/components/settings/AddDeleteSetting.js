import React, { Component } from 'react'
import { Button, Glyphicon, Panel } from 'react-bootstrap'

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

  renderItem(d, i, user, follows) {
    const { ItemRenderer, showFollow } = this.state
    const { onChangeItem, onDeleteItem, onFollowItem } = this.bound
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
        {showFollow && (
          <div style={{ display: 'inline-block' }}>
            <Glyphicon glyph="plus-sign" onClick={onFollowItem} data-idx={i} />
          </div>
        )}
        <div style={{ display: 'inline-block' }}>
          <Glyphicon glyph="trash" onClick={onDeleteItem} data-idx={i} />
        </div>
      </div>
    )
  }

  render() {
    const { items: itemList, user } = this.props
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
            <div>{(itemList || []).map((v, k) => renderItem(v, k, user))}</div>
          </Panel.Body>
        </Panel>
      </div>
    )
  }
}

/*
 */

export default AddDeleteSetting
