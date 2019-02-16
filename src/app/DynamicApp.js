import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

// views
import { AppHeader, AppFooter } from '../components/branding/AppHeaderAndFooter'
import AppMenu from '../components/app-menu/AppMenu'
import Calendar from '../components/event-calendar/EventCalendar'
import Settings from '../components/settings/Settings'

import { connectToStore } from './_FN'

// style
import './etc/App.css'

// flow
import connectCalendar from '../flow/connect/connectEventCalendar'
import connectAppMenu from '../flow/connect/connectAppMenu'
import connectSettings from '../flow/connect/connectSettings'
import connectApp from '../flow/connect/connectApp'

// Store
import { createInitialStore } from '../flow/store/storeManager'
import { Files } from '../components/export/Export'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMinus, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

library.add([faMinus, faPlus, faTrashAlt])

const store = createInitialStore()

export class DynamicApp extends Component {
  componentDidMount() {
    import('./LazyLoaded').then(({ initializeLazy }) => {
      initializeLazy(store)
    })
  }

  render() {
    const ConnectedCalendar = connectToStore(Calendar, connectCalendar, store)
    const ConnectedSettings = connectToStore(Settings, connectSettings, store)
    const ConnectedAppMenu = connectToStore(AppMenu, connectAppMenu, store)
    const { views, showSettings, showFiles, files } = this.props
    const { UserProfile } = views

    return (
      <div className="App">
        <header className="App-header">
          <Container>
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
          </Container>
        </header>
        {showSettings ? <ConnectedSettings /> : <ConnectedCalendar />}
        {showFiles && <Files files={files} />}
        <footer>
          <AppFooter />
        </footer>
      </div>
    )
  }
}

const ConnectedDynamicApp = connectToStore(DynamicApp, connectApp, store)

export default <ConnectedDynamicApp />
