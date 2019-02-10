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

  // Event Metadata
  title = ''
  uid = ''
  start = null

  constructor(hours, minutes, seconds, title, uid, start) {
    /**
     * Gets called when the app is first loaded and the Reminder object is created.
     */
    this.setReminderInterval(hours, minutes, seconds)

    // Set Metadata
    this.title = title
    this.uid = uid
    this.start = start
  }

  /**
   * Sets the hours, minutes and seconds of the timer, and takes an optional parameter which
   * will be true when the reminder interval is being loaded from local storage, to avoid
   * re-setting the local storage with the same value.
   */
  setReminderInterval = (hours, minutes, seconds) => {
    this.reminderInterval[0] = hours
    this.reminderInterval[1] = minutes
    this.reminderInterval[2] = seconds

    // If duration is positive, enable reminder
    this.isEnabled = hours >= 0 && minutes >= 0 && seconds > 0
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
