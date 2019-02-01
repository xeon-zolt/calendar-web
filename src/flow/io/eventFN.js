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

defaultColors = {
  navy: { color: "#001F3F" },
  blue: { color: "#0074D9" },
  aqua: { color: "#7FDBFF" },
  teal: { color: "#39CCCC" },
  olive: { color: "#3D9970" },
  green: { color: "#2ECC40" },
  lime: { color: "#01FF70" },
  yellow: { color: "#FFDC00" },
  orange: { color: "#FF851B" },
  red: { color: "#FF4136" },
  fuchsia: { color: "#F012BE" },
  purple: { color: "#B10DC9" },
  maroon: { color: "#85144B" },
  silver: { color: "#DDDDDD" },
  gray: { color: "#AAAAAA" },
  black: { color: "#111111" }
};
defaultColorList = Object.values(defaultColors);

export function guaranteeHexColor(hex) {
  return (
    hex ||
    defaultColorList[Math.floor(Math.random() * defaultColorsList.length)].color
  );
}

export function objectToArray(obj) {
  let out = obj;
  if (out && !Array.isArray(out)) {
    out = Object.values(out);
  }
  return out;
}
