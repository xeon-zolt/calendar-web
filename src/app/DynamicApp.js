import React, { Component } from 'react'

// views
import { AppHeader, AppFooter } from '../components/branding/AppHeaderAndFooter'
import AppMenu from '../components/app-menu/AppMenu'
import Calendar from '../components/event-calendar/EventCalendar'
import Settings from '../components/settings/Settings'

import { connectToStore } from './_FN'

// style
import './App.css'

// flow
import connectCalendar from '../flow/connect/connectEventCalendar'
import connectAppMenu from '../flow/connect/connectAppMenu'
import connectSettings from '../flow/connect/connectSettings'
import connectApp from '../flow/connect/connectApp'

// Store
import { createInitialStore } from '../flow/store/storeManager'
import Files from '../components/export/Export'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faMinus,
  faPlus,
  faTrashAlt,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons'

library.add([faMinus, faPlus, faTrashAlt, faUserCircle])

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
    const { views, showPage, files } = this.props
    const { UserProfile } = views

    return (
      <div className="App">
        <header className="App-header">
          <AppHeader
            UserProfile={UserProfile}
            ConnectedAppMenu={ConnectedAppMenu}
          />
        </header>
        {(!showPage || showPage === 'all' || showPage === 'public') && (
          <ConnectedCalendar />
        )}
        {showPage === 'settings' && <ConnectedSettings />}
        {showPage === 'files' && <Files files={files} />}
        <footer>
          <AppFooter />
        </footer>
      </div>
    )
  }
}

const ConnectedDynamicApp = connectToStore(DynamicApp, connectApp, store)

export default <ConnectedDynamicApp />
