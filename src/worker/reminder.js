const storage = window.localStorage

/**
 * The Reminder object contains the sound, the amount of time passed in hours and minutes, the interval
 * at which the reminder should be triggered and then the functionality to set the reminder interval.
 */
class Reminder {
  // Amount of time passed between each reminder interval
  hoursPassed = 0
  minutesPassed = 0
  secondsPassed = 0

  // Every [hours, minutes, seconds] the reminder should be triggered
  reminderInterval = []

  isEnabled = false

  constructor() {
    /**
     * Gets called when the app is first loaded and the Reminder object is created.
     * It sets the reminder interval to 2 hours if no local storage for the interval
     * is found. If there is local storage for the interval, it will grab that data and set
     * the current reminder interval.
     */
    if (
      storage.getItem('interval') === null ||
      storage.getItem('interval') === undefined
    ) {
      this.setReminderInterval(0, 0, 5)
    } else {
      const locallyStoredInterval = storage.getItem('interval').split(',')
      this.setReminderInterval(
        parseInt(locallyStoredInterval[0]),
        parseInt(locallyStoredInterval[1]),
        parseInt(locallyStoredInterval[2]),
        true
      )
    }
  }

  /**
   * Sets the hours and minutes of the timer, and takes an optional parameter which
   * will be true when the reminder interval is being loaded from local storage, to avoid
   * re-setting the local storage with the same value.
   */
  setReminderInterval = (hours, minutes, seconds, fromStorage = false) => {
    this.reminderInterval[0] = hours
    this.reminderInterval[1] = minutes
    this.reminderInterval[2] = seconds

    // If no reminder is set, disable the timer
    this.isEnabled = !(hours === 0 && minutes === 0 && seconds === 0)

    // If the data isn't from local storage, set the local storage to the current reminder interval
    if (!fromStorage) {
      storage.setItem(
        'interval',
        hours.toString() + ',' + minutes.toString() + ',' + seconds.toString()
      )
    }
  }

  /**
   * If reminders are enabled and the hours and minutes passed is the same as
   * the set interval, return true.
   */
  intervalHasPassed = () => {
    return (
      this.isEnabled &&
      this.hoursPassed === this.reminderInterval[0] &&
      this.minutesPassed === this.reminderInterval[1] &&
      this.secondsPassed === this.reminderInterval[2]
    )
  }
}

export default Reminder
