import moment from 'moment'

import Reminder from './reminder'

const storage = window.localStorage
let remindersArray

// Add reminder to localStorage
export const addReminder = (event, userSessionChat) => {
  let reminders = getReminders()

  const guests = [
    {
      name: 'fmdroid.id',
      identityAddress: '1Jx33eh9Ew9XJCZcCB3pcETHzUiVQhHz3x',
    },
  ]

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

  const timeout = moment(reminder).diff(moment(new Date()))

  let r = remindersArray.find(x => x.uid === uid)

  if (r) {
    r.setReminderInterval(timeout)

    // Update event metadata
    r.title = event.title
    r.start = event.start
    r.guests = guests
    r.userSessionChat = userSessionChat
  } else {
    remindersArray.push(
      new Reminder(
        timeout,
        event.title,
        uid,
        event.start,
        guests,
        userSessionChat
      )
    )
  }

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
export const initReminders = () => {
  const reminders = getReminders()
  let delUid = []

  remindersArray = Object.keys(reminders).map(key => {
    const now = moment.utc()
    const reminder = moment(reminders[key].reminder)
    const timeout = reminder.diff(now)

    // Store `uid` of events whose reminder time has passed
    // To be deleted from localStorage
    if (timeout < 0) {
      delUid.push(key)
    }

    return new Reminder(
      timeout,
      reminders[key].title,
      key,
      reminders[key].start
    )
  })

  delUid.forEach(uid => delete reminders[uid])

  setReminders(reminders)
}
