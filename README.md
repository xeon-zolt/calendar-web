# OI Calendar

Private, encrypted calendar in the cloud using Blockstack
![Logo](/public/android-chrome-192x192.png)

## Feature

-   create, read, update, delete events
-   publish events
-   send invitations
-   add events and calendars of other users or ics files
-   export/import in ical format

## Move from Google Calendar

Google provides a private link that contains all your events.
Unfortunately, Google does not let you easily use these events, you need either a [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) browser plugin.

1. Copy your private Google calendar url
    - Login to Google Calendar and goto settings: https://calendar.google.com/calendar/r/settings
    - Select your calendar on the left side
      ![Select](/resources/Screenshot%20from%202019-02-02%2002-10-33.png)
      ![Select3](/resources/Screenshot%20from%202019-02-02%2002-11-05.png)
    - Scroll to the bottom
    - Copy the private address of your calendar containing your email address and ends with `basic.ics`
      ![Select3](resources/Screenshot%20from%202019-02-02%2002-11-27.png)
1. Add to OI Calendar
    - Open OI Calendar https://cal.openintents.org/
    - Enable your CORS browser plugin
    - Paste the private address into the `Paste url ...` field and press enter
1. Enjoy YOUR calendar!

## App Developers

### Add event via web intent

Example: https://cal.openintents.org/?intent=addEvent&title=Blockstack%20Event&start=2018-12-31T23:00:00.000Z&end=2018-12-31T24:00:00.000Z

The following parameters are supported:

| name   | description                |
| ------ | -------------------------- |
| intent | "addEvent"                 |
| title  | the name of the event      |
| start  | date string in zulu format |
| end    | date string in zulu format |
| via    | the organizer              |

### Add calendar (read-only) via web intent

Example: https://cal.openintents.org/?intent=addics&url=https://fosdem.org/2019/schedule/track/decentralized_internet_and_privacy.ics

The following parameters are supported:

| name   | description                                      |
| ------ | ------------------------------------------------ |
| intent | "addics"                                         |
| url    | the location of the calendar file in iCal format |

## Development

This application utilizes <a href="https://github.com/intljusticemission/react-big-calendar"> react-big-calendar </a> and
<a href="https://github.com/YouCanBookMe/react-datetime"> react-datetime </a> components to add and remove events to a calendar.

To clone and run this application locally, execute the following command:

```
git clone https://github.com/openintents/calendar-web.git
cd oi-calendar
npm install
npm start
```
