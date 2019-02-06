import React, { Component } from 'react'
import { Button, Glyphicon, Panel } from 'react-bootstrap'

class AddDeleteSetting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      valueOfAdd: props.valueOfAdd || '',
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

  renderItem(d, i) {
    const { ItemRenderer } = this.state
    const { onChangeItem, onDeleteItem } = this.bound
    return (
      <div key={i} className="d-inline-block">
        <div style={{ display: 'inline-block', width: 320 }}>
          {ItemRenderer && (
            <ItemRenderer item={d} idx={i} onChangeItem={onChangeItem} />
          )}
        </div>
        <div style={{ display: 'inline-block' }}>
          <Glyphicon glyph="trash" onClick={onDeleteItem} data-idx={i} />
        </div>
      </div>
    )
  }

  render() {
    const { items: itemList } = this.props
    const { renderItem, onAddValueChange, onAddItem } = this.bound
    const { addPlaceholder, valueOfAdd, errorOfAdd } = this.state
    return (
      <div className="settings">
        <Panel style={{ width: '80%' }}>
          <Panel.Heading>New</Panel.Heading>
          <Panel.Body>
            <input
              placeholder={addPlaceholder}
              type="text"
              value={valueOfAdd}
              onChange={onAddValueChange}
              style={{ width: '80%' }}
            />
            <Button onClick={onAddItem} disabled={!valueOfAdd}>
              Add
            </Button>
            <span style={{ paddingLeft: 16 }}>{errorOfAdd}</span>
          </Panel.Body>
        </Panel>

        <Panel style={{ width: '80%' }}>
          <Panel.Heading>Yours</Panel.Heading>
          <Panel.Body>
            <div>{(itemList || []).map(renderItem)}</div>
          </Panel.Body>
        </Panel>
      </div>
    )
  }
}

/*
 */

export default AddDeleteSetting
