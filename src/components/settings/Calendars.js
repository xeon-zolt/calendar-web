import React, { Component } from "react";
import { Button } from "react-bootstrap";
const Calendar = props => {
  const { calendar } = props;
  const privateCalendar = calendar.type === "private";
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
      {privateCalendar && (
        <Button bsStyle="light">
          <span className="glyphicon glyphicon-pencil" />
        </Button>
      )}
    </div>
  );
};

export class Calendars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarToAdd: null
    };
    this.bound = ["handleDataChange", "addCalendar"].reduce((acc, d) => {
      acc[d] = this[d].bind(this);
      return acc;
    }, {});
  }

  renderCalendars(calendars) {
    const list = [];
    for (var i in calendars) {
      var calendar = calendars[i];
      list.push(<Calendar key={i} calendar={calendar} />);
    }
    return list;
  }

  addCalendar() {
    const { calendarToAdd } = this.state;
    const { addCalendar } = this.props;
    if (calendarToAdd && calendarToAdd.startsWith("http")) {
      addCalendar({
        name: "",
        type: "ics",
        mode: "read-only",
        data: { src: calendarToAdd }
      });
    } else {
      const parts = calendarToAdd.split("@");
      if (parts.length == 2) {
        const parts = calendarToAdd.split("@");
        const user = parts[1];
        const src = parts[0] + "/AllEvents";
        addCalendar({
          name: calendarToAdd,
          mode: "read-only",
          type: "blockstack-user",
          data: { user, src }
        });
      } else {
        this.setState({ error: "Invalid calendar " });
      }
    }
  }

  handleDataChange(e, ref) {
    const val = e.target.value;
    const stateUpdates = {};
    stateUpdates[ref] = val;
    this.setState(stateUpdates);
  }

  render() {
    const { calendars } = this.props;
    const view = this.renderCalendars(calendars);
    return (
      <div className="settings">
        <input
          hint="events@user.id"
          type="text"
          onChange={e => this.bound.handleDataChange(e, "calendarToAdd")}
        />
        <Button onClick={() => this.bound.addCalendar()}>Add</Button>
        {view}
      </div>
    );
  }
}
