import moment from 'moment'

import { getRemindersArray } from './utils'

let reminders = getRemindersArray()
let webWorker

/**
 * If web workers are supported, create a new one that utilises background_process.js
 * and store it inside of web_worker. Setup an event listener that is triggered when
 * postMessage() is called from within background_process.js. This event listener will call updateTimer(),
 * passing in the data received from postMessage() which should only contain a type and a value.
 */
export const startBackgroundProcess = () => {
  if (typeof Worker !== 'undefined') {
    if (typeof webWorker === 'undefined') {
      webWorker = new Worker('background_process.js')
    }

    webWorker.postMessage(['enabled', true])

    webWorker.onmessage = event => {
      updateTimer(event.data)
    }
  } else {
    window.alert('Browser not supported!')
  }
}

/**
 * The function that takes the new values from the counted timer on the web worker and
 * updates the html. It also controls when a sound should be played to signal a reminder and
 * autosaves the timer in localstorage every 10 seconds.
 */
const updateTimer = data => {
  // For every 30 seconds, update reminders from localStorage to watch for latest changes
  if (data.type === 'ss' && data.value % 30 === 0) {
    reminders = getRemindersArray()
  }

  reminders.forEach(reminder => {
    if (reminder.isEnabled) {
      /**
       * data is passed when the web worker posts a message and contains a type and a value.
       * data.type is either 'hh', 'mm' or 'ss' and the value is the corresponding updated value.
       */
      switch (data.type) {
        case 'ss':
          reminder.secondsPassed++
          break
        case 'mm':
          reminder.minutesPassed++
          break
        case 'hh':
          reminder.hoursPassed++
          break
        default:
          break
      }
    }

    /**
     * If the time passed has reached the set interval,
     * play a reminder sound and reset the time passed to be checked again
     */
    if (reminder.intervalHasPassed()) {
      reminder.hoursPassed = 0
      reminder.minutesPassed = 0
      reminder.secondsPassed = 0

      if (Notification.permission !== 'granted') {
        Notification.requestPermission()
      } else {
        const notification = new Notification(
          `${reminder.title} takes place ${moment
            .utc()
            .to(moment(reminder.start))}`,
          {
            icon: 'android-chrome-192x192.png',
            silent: true,
          }
        )

        notification.onclick = function() {
          window.location.href = `/?intent=view&uid=${reminder.uid}`
        }
      }
    }
  })
}
