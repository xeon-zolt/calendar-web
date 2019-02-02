# OI Calendar
Private, encrypted calendar in the cloud using Blockstack

## Feature
* create, read, update, delete events
* publish events
* send invitations
* add events and calendars of other users or ics files
* export/import in ical format
## Move from Google Calendar
1. Copy your private Google calendar url
    * Login to Google Calendar and goto settings: https://calendar.google.com/calendar/r/settings
    * Select your calendar on the left side
    * Scroll to the bottom
    * Copy the private address of your calendar containing your email address and ends with `basic.ics`
1. Paste url into OI Calendar
    * Open OI Calendar https://cal.openintents.org/
    * Paste the private address into the `Paste url ...` field and press enter
1. Enjoy YOUR calendar!

## Development
This application utilizes <a href="https://github.com/intljusticemission/react-big-calendar"> react-big-calendar </a> and 
<a href="https://github.com/YouCanBookMe/react-datetime"> react-datetime </a> components to add and remove events to a calendar.

To clone and run  this application locally, execute the following command:

```
git clone https://github.com/friedger/oi-calendar.git
cd oi-calendar
npm install
npm start
```

