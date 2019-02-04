import React, { Component } from "react";
import AddDeleteSetting from "./AddDeleteSetting";
import { uuid } from "../../flow/io/eventFN";

class CalendarItem extends Component {
  constructor(props) {
    super(props);
    const { type, name, disabled, hexColor } = props.item || {};
    const isPrivateDefault = type === "private" && name === "default";
    this.state = {
      disabled: isPrivateDefault ? false : disabled || false,
      hexColor: hexColor || "#000000",
      isPrivateDefault
    };
    this.bound = {
      onColorChange: this.onColorChange.bind(this),
      onVisibilityChange: this.onVisibilityChange.bind(this)
    };
  }

  onVisibilityChange(event) {
    const checked = event.target.checked;
    const { item: calendar, idx, onChangeItem } = this.props;
    onChangeItem(calendar, { disabled: !checked }, idx);
    this.setState({ disabled: !checked });
  }

  onColorChange(event) {
    const hexColor = event.target.value;
    console.log("onColorChange", event.target.value);
    const { item: calendar, idx, onChangeItem } = this.props;
    onChangeItem(calendar, { hexColor }, idx);
    this.setState({ hexColor });
  }

  render() {
    const { item: calendar } = this.props || {};
    const { hexColor, disabled, isPrivateDefault } = this.state;
    const { onColorChange, onVisibilityChange } = this.bound;

    //const privateCalendar = calendar.type === "private";
    return (
      <div>
        <input
          type="checkbox"
          checked={!disabled}
          disabled={isPrivateDefault}
          onChange={onVisibilityChange}
        />
        <input
          type="color"
          value={hexColor}
          onChange={onColorChange}
          style={{ marginRight: "20px", marginLeft: "5px" }}
        />

        <label>{(calendar || {}).name}</label>
        {/* TODO implement editCalendar
        {privateCalendar && (
          <Button variant="light">
            <span className="glyphicon glyphicon-pencil" />
          </Button>
        )}
        */}
      </div>
    );
  }
}

export default class Calendars extends AddDeleteSetting {
  constructor(props) {
    super(props);
    this.state.addPlaceholder =
      "e.g. public@user.id or https://calendar.google..../basic.ics";
    this.state.ItemRenderer = CalendarItem;
    this.state.addValueToItem = (valueOfAdd, asyncReturn) => {
      let newItem,
        errors = [];

      const { items } = this.props;
      const names = items.map(d => {
        return d.name;
      });
      if (names.includes(valueOfAdd)) {
        errors.push("Calendar already included");
      }

      if (valueOfAdd) {
        if (valueOfAdd.startsWith("http")) {
          newItem = {
            type: "ics",
            data: { src: valueOfAdd }
          };
        } else {
          const [src, user, more] = valueOfAdd.split("@");
          if (src && user && !more) {
            newItem = {
              type: "blockstack-user",
              data: { user, src: src + "/AllEvents" }
            };
          } else {
            errors.push("Invalid calendar ");
          }
        }
      }
      if (newItem) {
        const { type, data } = newItem;
        newItem = {
          uid: uuid(),
          type,
          name: valueOfAdd,
          mode: "read-only",
          data
        };
      }

      asyncReturn({
        item: newItem,
        error: (errors || []).join(" ")
      });
    };
  }
}
