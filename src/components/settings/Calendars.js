import React, { Component } from "react";
import { Button } from "react-bootstrap";
const Calendar = props => {
  const { calendar, handleDataChange } = props;
  //const privateCalendar = calendar.type === "private";
  return (
    <div>
      <input
        type="checkbox"
        checked={calendar.selected}
        value={calendar.selected}
        disabled={calendar.type === "private" && calendar.name === "default"}
        onChange={e => handleDataChange(e, "delete")}
      />
      <input
        type="color"
        disabled
        value={calendar.hexColor || ""}
        onChange={e => handleDataChange(e, "hexColor")}
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
};

export default class Calendars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarToAdd: props.addCalendarUrl,
      selectedCalendars: {}
    };
    this.bound = [
      "handleDataChange",
      "addCalendar",
      "deleteCalendars",
      "handleCalendarChange",
      "renderCalendars"
    ].reduce((acc, d) => {
      acc[d] = this[d].bind(this);
      return acc;
    }, {});
  }

  handleCalendarChange(calendar) {
    return (event, ref) => {
      const { selectedCalendars } = this.state;
      if (ref === "delete") {
        selectedCalendars[calendar.name] = event.target.checked;
        this.setState({ selectedCalendars });
      }
    };
  }

  renderCalendars(calendars) {
    const list = [];
    for (var i in calendars) {
      var calendar = calendars[i];
      list.push(
        <Calendar
          key={i}
          calendar={calendar}
          handleDataChange={this.handleCalendarChange(calendar)}
        />
      );
    }
    if (list.length === 0) {
      list.push(<p key={0} />);
    }
    return list;
  }

  addCalendar() {
    const { calendarToAdd } = this.state;
    const { addCalendar } = this.props;
    if (calendarToAdd) {
      if (calendarToAdd.startsWith("http")) {
        addCalendar({
          name: calendarToAdd,
          type: "ics",
          mode: "read-only",
          data: { src: calendarToAdd }
        });
        this.setState({ calendarToAdd: "" });
      } else {
        const parts = calendarToAdd.split("@");
        if (parts.length === 2) {
          const parts = calendarToAdd.split("@");
          const user = parts[1];
          const src = parts[0] + "/AllEvents";
          addCalendar({
            name: calendarToAdd,
            mode: "read-only",
            type: "blockstack-user",
            data: { user, src }
          });
          this.setState({ calendarToAdd: "" });
        } else {
          this.setState({
            error: "Invalid calendar "
          });
        }
      }
    }
  }

  deleteCalendars() {
    const { deleteCalendars, calendars } = this.props;
    const { selectedCalendars } = this.state;
    const calendarsToDelete = calendars.filter(c => selectedCalendars[c.name]);
    deleteCalendars(calendarsToDelete);
    this.setState({ selectedCalendars: {} });
  }

  handleDataChange(e, ref) {
    const val = e.target.value;
    const stateUpdates = {};
    stateUpdates[ref] = val;
    this.setState(stateUpdates);
  }

  render() {
    const { calendars, addCalendarUrl } = this.props;
    const { addCalendar, deleteCalendars, handleDataChange } = this.bound;
    const { selectedCalendars, calendarToAdd } = this.state;
    const view = this.renderCalendars(calendars);
    return (
      <div className="settings">
        <input
          placeholder="e.g. public@user.id or https://calendar.google..../basic.ics"
          type="text"
          value={addCalendarUrl}
          onChange={e => handleDataChange(e, "calendarToAdd")}
        />
        <Button
          onClick={() => addCalendar()}
          disabled={!calendarToAdd || calendarToAdd.length === 0}
        >
          Add
        </Button>
        {view}
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={deleteCalendars}
          disabled={
            !selectedCalendars ||
            Object.keys(selectedCalendars).filter(n => selectedCalendars[n])
              .length === 0
          }
        >
          Delete
        </Button>
      </div>
    );
  }
}
