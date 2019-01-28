import React, { Component } from "react";
import "./App.css";
import EventCalendar from "./containers/event-calendar/container";
import UserProfile from "./containers/auth-user-profile/container";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>
            <img
              src="/android-chrome-192x192.png"
              alt="logo"
              style={{ marginRight: "10px", height: "40px" }}
            />
            OI Calendar{" "}
          </h1>
          <UserProfile />
        </header>
        <EventCalendar />
        <footer>
          <hr />
          <h5>
            Developed By <a href="https://openintents.org">OpenIntents</a>, free
            and{" "}
            <a href="https://github.com/friedger/oi-calendar">open source</a>,
            based on work by{" "}
            <a href="https://github.com/yasnaraj/react-calendar-events-example">
              Yasna R.
            </a>{" "}
            | {new Date().getFullYear().toString()} <br />
            Using <a href="https://glyphicons.com">glyphicons.com</a>
          </h5>
        </footer>
      </div>
    );
  }
}

export default App;
