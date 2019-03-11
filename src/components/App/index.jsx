import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'

// Views
import Footer from '../Footer'
import Header from '../Header'

// Routes
import { routes } from '../../routes'

// Styles
import './App.css'
import { ConnectedRouter } from 'connected-react-router'

export class App extends Component {
	// componentDidMount() {
	//   import('./LazyLoaded').then(({ initializeLazy }) => {
	//     initializeLazy(store)
	//   })
	// }

	componentWillMount() {
		this.props.initializeLazyActions()(this.props.dispatch)
	}

	render() {
		return (
			<ConnectedRouter history={this.props.history}>
				<div className="App">
					<Header />

					{routes.map(route => (
						<Route key={route.path} {...route} />
					))}

					<Footer />
				</div>
			</ConnectedRouter>
		)
	}
}

App.propTypes = {
	history: PropTypes.object.isRequired,
}

export default App
