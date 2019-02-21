import ReactDOM from 'react-dom'

// App
import App from './app/DynamicApp'

// Styles
import './index.css'

// Service Worker
import registerServiceWorker from './registerServiceWorker'

registerServiceWorker()

ReactDOM.render(App, document.getElementById('root'))
