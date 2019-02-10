import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

// views
import { AppHeader, AppFooter } from '../components/branding/AppHeaderAndFooter'
import AppMenu from '../components/app-menu/AppMenu'
import Calendar from '../components/event-calendar/EventCalendar'
import Settings from '../components/settings/Settings'

import { connectToStore } from './_FN'

// style
import './etc/App.css'

// flow
import registerServiceWorker from '../flow/io/registerServiceWorker'
import connectCalendar from '../flow/connect/connectEventCalendar'
import connectAppMenu from '../flow/connect/connectAppMenu'
import connectSettings from '../flow/connect/connectSettings'
import connectApp from '../flow/connect/connectApp'
import { createInitialStore } from '../flow/store/storeManager'

let store = createInitialStore()
registerServiceWorker()

class DynamicApp extends Component {
  render() {
    const ConnectedCalendar = connectToStore(Calendar, connectCalendar, store)
    const ConnectedSettings = connectToStore(Settings, connectSettings, store)
    const ConnectedAppMenu = connectToStore(AppMenu, connectAppMenu, store)
    const { views, showSettings } = this.props
    const { UserProfile } = views

    //
    return (
      <div className="App">
        <header className="App-header">
          <Grid>
            <Row>
              <Col sm={1} xs={6}>
                <AppHeader />
              </Col>
              <Col sm={3} xs={6}>
                {UserProfile && <UserProfile />}
              </Col>
              <Col sm={6} xs={12}>
                <ConnectedAppMenu />
              </Col>
            </Row>
          </Grid>
        </header>
        {showSettings ? <ConnectedSettings /> : <ConnectedCalendar />}
        <footer>
          <AppFooter />
        </footer>
      </div>
    )
  }

  componentDidMount() {
    import('./LazyLoaded').then(({ initializeLazy }) => {
      initializeLazy(store)
      // this.forceUpdate();
    })
  }
}

const ConnectedDynamicApp = connectToStore(DynamicApp, connectApp, store)

export default <ConnectedDynamicApp />
