import ReactDOM from 'react-dom'

// App
import App from './app/DynamicApp'

// Styles
import './index.css'

// FontAwesome
import './fontawesome'

// Service Worker
import registerServiceWorker from './registerServiceWorker'

registerServiceWorker()

ReactDOM.render(App, document.getElementById('root'))
