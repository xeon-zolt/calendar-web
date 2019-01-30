import React, { Component } from "react";

const Calendar = props => {
  const { calendar } = props;
  return (
    <div>
      <input
        type="checkbox"
        checked={calendar.active}
        value={calendar.active}
      />
      <input
        type="color"
        value={calendar.hexColor || ""}
        onChange={e => props.handleDataChange(e, "hexColor")}
        style={{ marginRight: "20px", marginLeft: "5px" }}
      />
      <label>{calendar.name}</label>
    </div>
  );
};

export class Calendars extends Component {
  renderCalendars(calendars) {
    const list = [];
    for (var i in calendars) {
      var calendar = calendars[i];
      list.push(<Calendar key={i} calendar={calendar} />);
    }
    return list;
  }

  render() {
    const { calendars } = this.props;
    const view = this.renderCalendars(calendars);
    return <div className="settings">{view}</div>;
  }
}
