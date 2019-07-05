import * as Containers from './containers'

export const routes = [
  {
    component: Containers.CalendarContainer,
    exact: true,
    path: '/',
  },
  {
    component: Containers.PublicCalendarContainer,
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
  {
    component: Containers.HelpContainer,
    exact: true,
    path: '/help',
  },
]
