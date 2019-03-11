import { SHOW_FILES, SET_FILES } from '../ActionTypes'

function showFilesScreen(show) {
  return { type: SHOW_FILES, payload: { show } }
}

function newFile(files, f) {
  console.log('received ', f)
  if (f.endsWith('Contacts')) {
    files.contactListFile = files.appBucketUrl + f
  } else if (f.endsWith('Calendars')) {
    files.calendarListFile = files.appBucketUrl + f
  } else if (f.endsWith('public/AllEvents')) {
    files.calendars.public[0].url = files.appBucketUrl + f
  } else if (f.endsWith('public/AllEvents.ics')) {
    files.calendars.public[0].ics = files.appBucketUrl + f
  } else if (f.endsWith('default/AllEvents')) {
    files.calendars.private = [{ name: 'private', url: files.appBucketUrl + f }]
  } else if (f.endsWith('event.json') && f.startsWith('shared/')) {
    files.sharedEvents.push({ name: f, url: files.appBucketUrl + f })
  } else if (f.startsWith('msg/')) {
    if (!files.msgs) {
      files.msgs = []
    }
    files.msgs.push({ name: f, url: files.appBucketUrl + f })
  } else {
    files.others.push({ name: f, url: files.appBucketUrl + f })
  }
}

function setFiles(files, count) {
  return { type: SET_FILES, payload: { files, count } }
}

export function loadingFiles() {
  return (dispatch, getState) => {
    const files = initFiles(getState().auth.user)
    dispatch(setFiles(files, 0))
  }
}

function initFiles(user) {
  const files = {
    calendars: {
      public: [{ name: 'public' }],
    },
    others: [],
    sharedEvents: [],
  }
  files.appBucketUrl = user.profile.apps[window.origin]
  return files
}

export function showFiles() {
  return (dispatch, getState) => {
    const { userSession } = getState().auth
    dispatch(showFilesScreen(true))
    const files = initFiles(getState().auth.user)
    userSession
      .listFiles(f => {
        newFile(files, f)
        return true
      })
      .then(count => {
        dispatch(setFiles(files, count))
      })
  }
}
