# OI Calendar
Private, encrypted calendar in the cloud using Blockstack
![Logo](/public/android-chrome-192x192.png)
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
    ![Select](/resources/Screenshot%20from%202019-02-02%2002-10-33.png)
    ![Select3](/resources/Screenshot%20from%202019-02-02%2002-11-05.png)
    * Scroll to the bottom
    * Copy the private address of your calendar containing your email address and ends with `basic.ics`
    ![Select3](resources/Screenshot%20from%202019-02-02%2002-11-27.png)
1. Paste url into OI Calendar
    * Open OI Calendar https://cal.openintents.org/
    * Paste the private address into the `Paste url ...` field and press enter
1. Enjoy YOUR calendar!

## App Developers
### Add event via web intent
Create a link like https://cal.openintents.org/?intent=addEvent&title=Blockstack%20Event&start=2018-12-31T23:00:00.000Z&end=2018-12-31T24:00:00.000Z
https://cal.openintents.org/?intent=addics&url=https://fosdem.org/2019/schedule/track/decentralized_internet_and_privacy.ics
### Add calendar (read-only)

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

