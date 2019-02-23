import {
  SET_CALENDARS,
  SHOW_SETTINGS,
  HIDE_SETTINGS,
  SHOW_SETTINGS_ADD_CALENDAR,
} from '../ActionTypes'
import { fetchCalendars, publishCalendars } from '../../core/event'
import { defaultCalendars } from '../../core/eventDefaults'
import { guaranteeHexColor } from '../../core/eventFN'

// ################
// When initializing app
// ################

function resetCalendars(calendars) {
  return (dispatch, getState) => {
    publishCalendars(calendars)
    dispatch({ type: SET_CALENDARS, payload: calendars })
  }
}

export function initializeCalendars() {
  return (dispatch, getState) => {
    return fetchCalendars().then(calendars => {
      if (!calendars) {
        calendars = defaultCalendars
      } else if (calendars.length === 0) {
        calendars.push(defaultCalendars[0])
      } else {
        calendars = calendars.filter(d => d)
      }
      // publish now as other devices fetch before storing
      dispatch(resetCalendars(calendars))
      return calendars
    })
  }
}

// ################
// In Settings
// ################

export function showSettings() {
  return {
    type: SHOW_SETTINGS,
  }
}

export function hideSettings() {
  console.log('hideSettings')
  return {
    type: HIDE_SETTINGS,
  }
}

export function showSettingsAddCalendar(url) {
  return { type: SHOW_SETTINGS_ADD_CALENDAR, payload: { url } }
}

export function addCalendar(calendar) {
  console.log('addCalendar => ', calendar)
  calendar.hexColor = guaranteeHexColor(calendar.hexColor)
  return (dispatch, getState) => {
    fetchCalendars().then(calendars => {
      // TODO check for duplicates
      // :TODO: We need to actually import calendars, add uid etc.
      dispatch(resetCalendars([...calendars, calendar]))
    })
  }
}

export function deleteCalendars(deleteList) {
  return (dispatch, getState) => {
    fetchCalendars().then(calendars => {
      const uids = deleteList.map(d => d.uid)
      const newCalendars = calendars.filter(d => {
        return !uids.includes(d.uid)
      })
      dispatch(resetCalendars(newCalendars))
    })
  }
}

export function setCalendarData(calendar, newData) {
  return async (dispatch, getState) => {
    fetchCalendars().then(calendars => {
      const newCalendars = calendars.map(d => {
        if (d.uid === calendar.uid) {
          d = Object.assign({}, d, newData)
        }
        return d
      })
      console.log(newCalendars)
      dispatch(resetCalendars(newCalendars))
    })
  }
}
