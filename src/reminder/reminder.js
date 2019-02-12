import moment from 'moment'

/**
 * The Reminder object contains the timerId and metadata of the event
 */
class Reminder {
  // Timer ID
  timerId = 0

  // Event Metadata
  title = ''
  uid = ''
  start = null

  constructor(timeout, title, uid, start) {
    /**
     * Gets called when the app is first loaded and the Reminder object is created.
     */
    this.setReminderInterval(timeout)

    // Set Metadata
    this.title = title
    this.uid = uid
    this.start = start
  }

  setReminderInterval = timeout => {
    // If duration is positive, enable reminder
    if (timeout > 0) {
      // Clear existing timer
      if (this.timerId) {
        clearTimeout(this.timerId)
      }

      this.timerId = setTimeout(this.notifyUser, timeout)
    }
  }

  // Popup the notification to remind user about the event
  notifyUser = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    } else {
      const notification = new Notification(
        `${this.title} takes place ${moment.utc().to(moment(this.start))}`,
        {
          icon: 'android-chrome-192x192.png',
          silent: true,
        }
      )

      notification.onclick = function() {
        window.location.href = `/?intent=view&uid=${this.uid}`
      }
    }
  }
}

export default Reminder
