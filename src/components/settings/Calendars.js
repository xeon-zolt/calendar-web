import React, { Component } from "react";
import { Button, Glyphicon } from "react-bootstrap";
import AddDeleteSetting from "./AddDeleteSetting";

class CalendarItem extends Component {
  constructor(props) {
    super(props);
    this.state = { checked: props.item.visible || false };
    this.bound = {
      onColorChange: this.onColorChange.bind(this),
      onVisibilityChange: this.onVisibilityChange.bind(this)
    };
  }

  onVisibilityChange(event) {
    const { item: calendar, idx, onChangeItem } = this.props;
    calendar.selected = !calendar.selected;
    onChangeItem(calendar, { visible: calendar.selected }, idx);
  }

  onColorChange(event) {
    const { item: calendar, idx, onChangeItem } = this.props;
    const color = event.target.value;
    onChangeItem(calendar, { hexColor: color }, idx);
  }

  render() {
    const { item: calendar, idx } = this.props;
    const { onColorChange, onVisibilityChange } = this.bound;
    const isPrivateDefault =
      calendar.type === "private" && calendar.name === "default";
    //const privateCalendar = calendar.type === "private";
    return (
      <div>
        <input
          type="checkbox"
          checked={isPrivateDefault ? true : calendar.selected}
          data-x={idx}
          disabled={isPrivateDefault}
          onChange={onVisibilityChange}
        />
        <input
          type="color"
          value={calendar.hexColor || ""}
          onChange={onColorChange}
          style={{ marginRight: "20px", marginLeft: "5px" }}
        />

        <label>{calendar.name}</label>
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
      let newItem, errors;
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
      asyncReturn({ result: newItem, error: errors.join(" ") });
    };
  }
}
