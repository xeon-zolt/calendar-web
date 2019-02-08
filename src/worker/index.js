import Reminder from './reminder'

let canUseNotifications = true
let reminderData = new Reminder()
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

    webWorker.postMessage(['state_change', true])

    webWorker.onmessage = event => {
      console.log(event)
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
  console.log(data)

  /**
   * data is passed when the web worker posts a message and contains a type and a value.
   * data.type is either 'hh', 'mm' or 'ss' and the value is the corresponding updated value.
   */
  switch (data.type) {
    case 'ss':
      reminderData.secondsPassed++

      // If 10 seconds has passed, update the local storage
      // if (data.value % 10 === 0) {
      //   setAllStorage()
      // }

      break
    case 'mm':
      reminderData.minutesPassed++
      break
    case 'hh':
      reminderData.hoursPassed++
      break
  }

  /**
   * If the time passed has reached the set interval,
   * play a reminder sound and reset the time passed to be checked again
   */
  if (reminderData.intervalHasPassed()) {
    reminderData.hoursPassed = 0
    reminderData.minutesPassed = 0

    if (canUseNotifications) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission()
      } else {
        const notification = new Notification('Times up!', {
          icon: 'icon-144x144.png',
          silent: true,
        })

        notification.onclick = function() {
          notification.close()
        }
      }
    }
  }
}
