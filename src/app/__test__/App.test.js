import ReactDOM from 'react-dom'
import { DynamicApp } from '../DynamicApp'

let EventCalendar = props => {
  return <div>EventCalenda r</div>
}
let UserProfile = props => {
  return <div>UserProfile</div>
}

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<DynamicApp views={{ EventCalendar, UserProfile }} />, div)
  ReactDOM.unmountComponentAtNode(div)
})
