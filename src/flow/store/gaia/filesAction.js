import { listFiles } from "blockstack/lib/storage";
import { SHOW_FILES, SET_FILES } from "../ActionTypes";

function showFilesScreen(show) {
  return { type: SHOW_FILES, payload: { show } };
}

function newFile(files, f) {
  const publicCalendar = {};
  if (f.endsWith("Contacts")) {
    files.contactListFile = f;
  } else if (f.endsWith("Calendars")) {
    files.calendarListFile = f;
  } else if (f.endsWith("public/AllEvents")) {
    publicCalendar.url = f;
  } else if (f.endsWith("public/AllEvents.ics")) {
    publicCalendar.ics = f;
  } else if (f.endsWith("default/AllEvents")) {
    files.calendars.private = [{ name: "default", url: f }];
  } else {
    const filename = f;
    files.others.push({ name: { filename }, url: f });
  }
  files.calendars.public = [publicCalendar]; // there can be more in the future
  return { type: SET_FILES, payload: { files, count: -1, lastAdded: f } };
}
function lastFile(files, count) {
  return { type: SET_FILES, payload: { files, count } };
}

export function showFiles() {
  return (dispatch, getState) => {
    dispatch(showFilesScreen(true));
    const { files } = getState().gaia;
    listFiles(f => {
      dispatch(newFile(files, f));
      return true;
    }).then(count => {
      dispatch(lastFile(files, count));
    });
  };
}
