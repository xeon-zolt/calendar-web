import React from 'react'
import ReactDOM from 'react-dom'
import { App } from '..'

let Calendar = props => {
  return <div>Calendar</div>
}
let UserProfile = props => {
  return <div>UserProfile</div>
}

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App views={{ Calendar, UserProfile }} />, div)
  ReactDOM.unmountComponentAtNode(div)
})
