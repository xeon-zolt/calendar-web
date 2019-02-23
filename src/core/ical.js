import { parse, Component, Event } from '../../node_modules/ical.js/build/ical'
import { createEvents } from 'ics'
import moment from 'moment'

function eventFromIcal(d) {
  var vevent = new Event(d)
  return {
    title: vevent.summary,
    start: vevent.startDate.toJSDate().toISOString(),
    end: vevent.endDate.toJSDate().toISOString(),
    duration: vevent.duration ? durationFromObject(vevent.duration) : null,
    uid: vevent.uid,
  }
}

export function iCalParseEvents(icsContent, formatEvent) {
  try {
    var jCal = parse(icsContent)
    var comp = new Component(jCal)
    console.log('comp', comp)
    var vevents = comp.getAllSubcomponents('vevent')
    return vevents.map(eventFromIcal)
  } catch (e) {
    console.log('ics error', e)
  }
}

export function eventAsIcs(event) {
  let { title, description, start, end, allDay, uid, duration } = event
  start = dateToArray(allDay, new Date(start))
  end = dateToArray(allDay, new Date(end))
  duration = durationToObject(duration)
  return { title, description, start, end, uid, duration }
}

export function icsFromEvents(events) {
  try {
    var { error, value } = createEvents(Object.values(events).map(eventAsIcs))
    if (error) {
      console.log('error creating ics', error)
    } else {
      return value
    }
  } catch (e) {
    console.log('failed to format events', e)
  }
}

function dateToArray(allDay, date) {
  let base = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  if (allDay) {
    return base
  } else {
    return base.concat([date.getHours(), date.getMinutes(), date.getSeconds()])
  }
}

function durationToObject(time) {
  if (time != null) {
    let duration = moment.duration(time)
    return {
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    }
  }

  return null
}

function durationFromObject(obj) {
  return pad(obj.hours, 2) + ':' + pad(obj.minutes, 2)
}

function pad(num, size) {
  var s = num + ''
  while (s.length < size) s = '0' + s
  return s
}
