import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Router } from 'react-router'

// Views
import Footer from '../Footer'
import Header from '../Header'
// import AppMenu from '../AppMenu'
// import Calendar from '../Calendar'
// import Settings from '../Settings'
// import Files from '../Export'

// Routes
import { routes } from '../../routes'

// Styles
import './App.css'

// flow
// import connectCalendar from '../containers/Calendar'
// import connectAppMenu from '../containers/AppMenu'
// import connectSettings from '../containers/Settings'
// import connectFiles from '../containers/Files'

export class App extends Component {
	// componentDidMount() {
	//   import('./LazyLoaded').then(({ initializeLazy }) => {
	//     initializeLazy(store)
	//   })
	// }

	render() {
		// const ConnectedCalendar = connectToStore(Calendar, connectCalendar, store)
		// const ConnectedSettings = connectToStore(Settings, connectSettings, store)
		// const ConnectedAppMenu = connectToStore(AppMenu, connectAppMenu, store)
		// const ConnectedFiles = connectToStore(Files, connectFiles, store)

		return (
			<Router history={this.props.history}>
				<div className="App">
					<Header />

					{routes.map(route => (
						<Route key={route.path} {...route} />
					))}

					{/* {(!showPage || showPage === 'all' || showPage === 'public') && ( */}
					{/* <ConnectedCalendar /> */}
					{/* )} */}
					{/* {showPage === 'settings' && <ConnectedSettings />} */}
					{/* {showPage === 'files' && <ConnectedFiles />} */}

					<Footer />
				</div>
			</Router>
		)
	}
}

App.propTypes = {
	history: PropTypes.object.isRequired,
}

export default App
