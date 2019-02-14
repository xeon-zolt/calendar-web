import ReactDOM from 'react-dom'

// App
import App from './app/DynamicApp'

// Styles
import './index.css'

// Reminders
import { initReminders } from './reminder'

initReminders()

ReactDOM.render(App, document.getElementById('root'))
