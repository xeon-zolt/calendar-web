import React from 'react'
import * as Containers from './containers'

export const routes = [
  {
    component: Containers.CalendarContainer,
    exact: true,
    path: '/',
  },
  {
    component: props => <Containers.CalendarContainer {...props} public />,
    exact: true,
    path: '/public',
  },
  {
    component: Containers.SettingsContainer,
    exact: true,
    path: '/settings',
  },
  {
    component: Containers.FilesContainer,
    exact: true,
    path: '/files',
  },
]
