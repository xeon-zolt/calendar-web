export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function sharedUrl(eventUid) {
  return "shared/" + eventUid + "/event.json";
}

export function parseQueryString(query) {
  return (query.replace(/^\?/, "").split("&") || []).reduce((acc, d) => {
    const [k, v] = d.split("=");
    if (k) {
      acc[k] = v;
    }
    return acc;
  }, {});
}

export function guaranteeHexColor(hex) {
  return hex || "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export function eventAsIcs(event) {
  let { title, description, start, end, allDay, uid } = event;
  start = dateToArray(allDay, new Date(start));
  end = dateToArray(allDay, new Date(end));
  return { title, description, start, end, uid };
}

function dateToArray(allDay, date) {
  let base = [date.getFullYear(), date.getMonth() + 1, date.getDay()];
  if (allDay) {
    return base;
  } else {
    return base.concat([date.getHours(), date.getMinutes(), date.getSeconds()]);
  }
}
