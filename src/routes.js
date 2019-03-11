import * as Containers from './containers'

export const routes = [
  {
    component: Containers.CalendarContainer,
    exact: true,
    path: '/',
  },
  {
    component: Containers.CalendarContainer,
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
