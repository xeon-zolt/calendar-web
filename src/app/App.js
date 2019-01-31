import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import "./App.css";
import { AppHeader, AppFooter } from "./AppHeaderAndFooter";

class App extends Component {
  render() {
    const { views } = this.props;
    const { EventCalendar, UserProfile, Settings, AppMenu } = views;
    return (
      <div className="App">
        <header className="App-header">
          <AppHeader>
            <Row>
              <Col sm={6} md={8} />
              <Col xs={6} sm={4} md={2}>
                <UserProfile />
              </Col>
              <Col xs={6} sm={2} md={2}>
                <AppMenu />
              </Col>
            </Row>
          </AppHeader>
        </header>
        <Settings />
        <EventCalendar />
        <footer>
          <AppFooter />
        </footer>
      </div>
    );
  }
}

export default App;
