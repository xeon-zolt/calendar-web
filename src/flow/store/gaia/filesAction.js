import { listFiles } from 'blockstack'
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
  } else {
    const filename = f
    files.others.push({ name: filename, url: files.appBucketUrl + f })
  }
}
function lastFile(files, count) {
  return { type: SET_FILES, payload: { files, count } }
}

export function showFiles() {
  return (dispatch, getState) => {
    dispatch(showFilesScreen(true))
    const files = {
      calendars: {
        public: [{ name: 'public' }],
      },
      others: [],
      sharedEvents: [],
    }
    const { user } = getState().auth

    files.appBucketUrl = user.profile.apps[window.origin]
    listFiles(f => {
      newFile(files, f)
      return true
    }).then(count => {
      dispatch(lastFile(files, count))
    })
  }
}
