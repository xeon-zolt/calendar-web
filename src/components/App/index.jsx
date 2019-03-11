import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Router } from 'react-router'

// Views
import Footer from '../Footer'
import Header from '../Header'

// Routes
import { routes } from '../../routes'

// Styles
import './App.css'

export class App extends Component {
	// componentDidMount() {
	//   import('./LazyLoaded').then(({ initializeLazy }) => {
	//     initializeLazy(store)
	//   })
	// }

	render() {
		return (
			<Router history={this.props.history}>
				<div className="App">
					<Header />

					{routes.map(route => (
						<Route key={route.path} {...route} />
					))}

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
