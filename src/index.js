import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'

// App
import App from './components/App'

// Redux Store
import store, { history } from './store'

// Styles
import './index.css'

// FontAwesome
import './fontawesome'

// Service Worker
import registerServiceWorker from './registerServiceWorker'
import { initializeLazyActions } from './store/event/eventActionLazy'

registerServiceWorker()
const ConnectedApp = connect()(App)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp
      history={history}
      initializeLazyActions={initializeLazyActions}
    />
  </Provider>,
  document.getElementById('root')
)
