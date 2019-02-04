import React, { Component } from "react";
import { Button, Glyphicon } from "react-bootstrap";

class AddDeleteSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueOfAdd: props.valueOfAdd
    };
    this.bound = [
      "renderItem",
      "onAddValueChange",
      "onAddItem",
      "onDeleteItem",
      "onChangeItem"
    ].reduce((acc, d) => {
      acc[d] = this[d].bind(this);
      return acc;
    }, {});
  }

  onAddValueChange(event) {
    const valueOfAdd = event.target.value;
    this.setState({ valueOfAdd });
  }

  onAddItem(event) {
    const { valueOfAdd, addValueToItem } = this.state;
    const { addItem } = this.props;
    addValueToItem(valueOfAdd, ({ result, error }) => {
      if (error) {
        this.setState({
          valueOfAdd,
          errorOfAdd: error
        });
      } else {
        addItem(
          Object.assign({}, result, {
            name: valueOfAdd,
            mode: "read-only"
          })
        );
        this.setState({ valueOfAdd: undefined, errorOfAdd: undefined });
      }
    });
  }

  onDeleteItem(event) {
    const { items: itemList, deleteItems } = this.props;
    const target = event.target;
    const { idx } = event.target.dataset;
    const item = itemList[idx];
    deleteItems([item]);
  }

  onChangeItem(item, data) {
    const { setItemData } = this.props;
    setItemData(item, data);
  }

  renderItem(d, i) {
    const { ItemRenderer } = this.state;
    const { onChangeItem, onDeleteItem } = this.bound;
    return (
      <div key={i} className="d-inline-block">
        <div style={{ display: "inline-block", width: 240 }}>
          {ItemRenderer && (
            <ItemRenderer item={d} idx={i} onChangeItem={onChangeItem} />
          )}
        </div>
        <div style={{ display: "inline-block" }}>
          <Glyphicon glyph="trash" onClick={onDeleteItem} data-idx={i} />
        </div>
      </div>
    );
  }

  render() {
    const { items: itemList } = this.props;
    const { renderItem, onAddValueChange, onAddItem } = this.bound;
    const { addPlaceholder, valueOfAdd, errorOfAdd } = this.state;
    return (
      <div className="settings">
        <input
          placeholder={addPlaceholder}
          type="text"
          value={valueOfAdd}
          onChange={onAddValueChange}
          style={{ width: 300 }}
        />
        <Button onClick={onAddItem} disabled={!valueOfAdd}>
          Add
        </Button>
        {errorOfAdd && <span>{errorOfAdd}</span>}
        <div>{(itemList || []).map(renderItem)}</div>
      </div>
    );
  }
}

export default AddDeleteSetting;
