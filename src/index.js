import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

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

registerServiceWorker()

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root')
)
