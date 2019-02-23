import React, { Component } from 'react'

// views
import Footer from '../components/Footer'
import Header from '../components/Header'
import AppMenu from '../components/AppMenu'
import Calendar from '../components/EventCalendar'
import Settings from '../components/Settings'

import { connectToStore } from './_FN'

// style
import './App.css'

// flow
import connectCalendar from '../containers/EventCalendar'
import connectAppMenu from '../containers/AppMenu'
import connectSettings from '../containers/Settings'
import connectApp from '../containers/App'

// Store
import { createInitialStore } from '../store/storeManager'
import Files from '../components/Export'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faMinus,
  faPlus,
  faTrashAlt,
  faUserCircle,
  faSync,
  faHandHoldingHeart,
  faFileCode,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons'
import connectFiles from '../containers/Files'

library.add([
  faMinus,
  faPlus,
  faTrashAlt,
  faUserCircle,
  faSync,
  faHandHoldingHeart,
  faFileCode,
  faQuestion,
])

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
    const ConnectedFiles = connectToStore(Files, connectFiles, store)
    const { views, showPage } = this.props
    const { UserProfile } = views

    return (
      <div className="App">
        <Header UserProfile={UserProfile} ConnectedAppMenu={ConnectedAppMenu} />

        {(!showPage || showPage === 'all' || showPage === 'public') && (
          <ConnectedCalendar />
        )}
        {showPage === 'settings' && <ConnectedSettings />}
        {showPage === 'files' && <ConnectedFiles />}

        <Footer />
      </div>
    )
  }
}

const ConnectedDynamicApp = connectToStore(DynamicApp, connectApp, store)

export default <ConnectedDynamicApp />
