import ReactDOM from 'react-dom'
import './index.css'
import App from './app/DynamicApp'
import { startBackgroundProcess } from './worker'

startBackgroundProcess()

ReactDOM.render(App, document.getElementById('root'))
