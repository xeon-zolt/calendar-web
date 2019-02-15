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

  constructor(timeout, title, uid, start, guests, userSessionChat) {
    /**
     * Gets called when the app is first loaded and the Reminder object is created.
     */
    this.setReminderInterval(timeout)

    // Set Metadata
    this.title = title
    this.uid = uid
    this.start = start
    this.guests = guests
    this.userSessionChat = userSessionChat
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
    const msg = `${this.title} takes place ${moment
      .utc()
      .to(moment.utc(this.start))}`
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    } else {
      const notification = new Notification(msg, {
        icon: 'android-chrome-192x192.png',
        silent: true,
      })

      notification.onclick = () => {
        window.location.href = `/?intent=view&uid=${this.uid}`
      }
    }
    if (this.userSessionChat) {
      const springRolePromises = this.guests.map(g => {
        return fetch(
          `https://beta.springrole.com/blockstack/${g.identityAddress}`
        ).then(response => {
          if (response.ok) {
            return g
          } else {
            return undefined
          }
        })
      })
      Promise.all(springRolePromises).then(springRoleGuests => {
        let message

        springRoleGuests = springRoleGuests.filter(g => !!g)
        if (springRoleGuests.length > 0) {
          const links = springRoleGuests.map(
            g =>
              `<a href="https://beta.springrole.com/blockstack/${
                g.identityAddress
              }">${g.name}</a>`
          )
          const names = this.guests.map(g => g.name)
          message = {
            msgtype: 'm.text',
            body: `${msg}. Read more about your guests here: ${names.join(
              ', '
            )}`,
            format: 'org.matrix.custom.html',
            formatted_body: `${msg}. Read more about your guests here: ${links.join(
              ', '
            )}`,
          }
        } else {
          message = {
            msgtype: 'm.text',
            body: `${msg}`,
            format: 'org.matrix.custom.html',
            formatted_body: `${msg}`,
          }
          this.userSessionChat.sendMessageToSelf(message)
        }
      })
    }
  }
}

export default Reminder
