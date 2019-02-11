var assert = require('assert')
var iCal = require('../src/flow/io/ical')
var fs = require('fs')

// eslint-disable-next-line node/no-deprecated-api
require.extensions['.ics'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8')
}

var ICS_EXAMPLE_FILE = require('./ICS_EXAMPLE_FILE.ics')

describe('Import/Export iCal (testing duration field)', () => {
  describe('importing', () => {
    it('should import events with duration', () => {
      let events = iCal.iCalParseEvents(ICS_EXAMPLE_FILE)
      assert.strictEqual(events.length, 1, 'Should return one event')
      assert.strictEqual(
        events[0].duration,
        '06:30',
        'Should return the duration in the expected format'
      )
    })

    it('should export events with duration', () => {
      let event = {
        title: 'Test',
        description: 'Test',
        start: new Date(),
        duration: '06:30',
      }

      let icsEvent = iCal.eventAsIcs(event)
      console.log(icsEvent)
      assert.notStrictEqual(icsEvent, null, 'Should return one event')
      assert.strictEqual(
        icsEvent.duration.hours,
        6,
        'Should return duration in the expected format'
      )

      assert.strictEqual(
        icsEvent.duration.minutes,
        30,
        'Should return duration in the expected format'
      )

      assert.strictEqual(
        icsEvent.duration.seconds,
        0,
        'Should return duration in the expected format'
      )
    })
  })
})
