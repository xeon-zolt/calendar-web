const storage = window.localStorage

// Sets all of the stored values of the reminder
export const addReminderToLocalStorage = (uuid, reminder) => {
  storage.setItem('uuid', reminder)
}
