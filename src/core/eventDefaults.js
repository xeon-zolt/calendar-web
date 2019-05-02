import moment from 'moment'
import { uuid } from './eventFN'

export const defaultEvents = [
  {
    id: 0,
    title: 'Today!',
    allDay: true,
    start: new Date(moment()), // :Q: is moment really required here?
    end: new Date(moment()),
    hexColor: '#001F3F',
    notes: 'Have a great day!',
  },
]

const uuids = [uuid(), uuid(), uuid()]

export let defaultCalendars = [
  {
    uid: uuids[0],
    type: 'private',
    name: 'default',
    data: { src: 'default/AllEvents', events: defaultEvents },
    hexColor: '#001F3F',
  },
  {
    uid: uuids[1],
    type: 'blockstack-user',
    name: 'public@friedger.id',
    mode: 'read-only',
    data: { user: 'friedger.id', src: 'public/AllEvents' },
    hexColor: '#2ECC40',
  },
  {
    uid: uuids[2],
    type: 'ics',
    name: 'US Holidays',
    mode: 'read-only',
    data: {
      src: 'https://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics',
    },
    hexColor: '#FF851B',
  },
]
