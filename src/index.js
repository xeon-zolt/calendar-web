import ReactDOM from 'react-dom'

// App
import App from './app/DynamicApp'

// Styles
import './index.css'

// Reminders
import { initReminders } from './reminder'

// Service Worker
import registerServiceWorker from './registerServiceWorker'

initReminders()
registerServiceWorker()

ReactDOM.render(App, document.getElementById('root'))
