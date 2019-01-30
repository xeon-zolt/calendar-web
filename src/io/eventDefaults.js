import moment from "moment";

export const defaultEvents = [
  {
    id: 0,
    title: "Today!",
    allDay: true,
    start: new Date(moment()), // :Q: is moment really required here?
    end: new Date(moment()),
    hexColor: "#265985",
    notes: "Have a great day!"
  }
];

export const defaultCalendars = [
  {
    type: "private",
    name: "default",
    data: { src: "default/AllEvents", events: defaultEvents }
  },
  {
    type: "blockstack-user",
    name: "public@friedger.id",
    mode: "read-only",
    data: { user: "friedger.id", src: "public/AllEvents" }
  },
  {
    type: "ics",
    name: "holidays",
    mode: "read-only",
    data: {
      src:
        "https://calendar.google.com/calendar/ical/de.be%23holiday%40group.v.calendar.google.com/public/basic.ics"
    },
    hexColor: "#b8004f"
  }
];
