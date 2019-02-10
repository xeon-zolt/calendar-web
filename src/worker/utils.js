import moment from 'moment'

import Reminder from './reminder'

const storage = window.localStorage

// Add reminder to localStorage
export const addReminder = event => {
  let reminders = getReminders()

  const uid = event.uid
  let eventData = {
    start: event.start,
    title: event.title,
  }

  const reminder = new Date(event.start)
  const reminderTime = parseInt(event.reminderTime, 10)

  if (event.reminderTimeUnit === 'minutes') {
    reminder.setMinutes(reminder.getMinutes() - reminderTime)
  } else {
    reminder.setHours(reminder.getHours() - reminderTime)
  }

  eventData.reminder = reminder

  reminders[uid] = eventData

  setReminders(reminders)
}

// Get reminders from localStorage
export const getReminders = () => {
  try {
    return JSON.parse(storage.getItem('reminders')) || {}
  } catch (e) {
    return {}
  }
}

// Set reminders to localStorage
export const setReminders = reminders => {
  storage.setItem('reminders', JSON.stringify(reminders))
}

// Get `Reminder` Array from localStorage
export const getRemindersArray = () => {
  const reminders = getReminders()
  let remindersArray = []
  let delUid = []

  remindersArray = Object.keys(reminders).map(key => {
    const now = moment.utc()
    const reminder = moment(reminders[key].reminder)
    const duration = moment.duration(reminder.diff(now))

    // Store `uid` of events whose reminder time has passed
    // To be deleted from localStorage
    if (duration.get('seconds') < 0) {
      delUid.push(key)
    }

    return new Reminder(
      duration.get('hours'),
      duration.get('minutes'),
      duration.get('seconds'),
      reminders[key].title,
      key,
      reminders[key].start
    )
  })

  delUid.forEach(uid => delete reminders[uid])

  setReminders(reminders)

  return remindersArray
}
