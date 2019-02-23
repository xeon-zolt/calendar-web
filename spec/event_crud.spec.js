var assert = require('assert')
var storeManager = require('../src/store/storeManager')
var eventActionLazy = require('../src/store/event/eventActionLazy')

const store = storeManager.createInitialStore({})
const EVENT_URL =
  'https://chat.openintents.org/#/room/#oi-calendar:openintents.modular.im'

describe('CRUD Events', () => {
  describe('add private event', () => {
    it('should store a new private event', () => {
      store
        .dispatch(
          eventActionLazy.addEvent({
            title: 'Testing add private event',
            url: EVENT_URL,
          })
        )
        .then(() => {
          const allEvents = store.getState().events.allEvents
          assert.strict.equal(
            allEvents,
            2,
            'Should contain default event and new event'
          )
          assert.strict.equal(
            allEvents[1].url,
            EVENT_URL,
            'Should contain the correcly event url'
          )
        })
    })
  })

  describe('add public event', () => {
    it('should publish the event', () => {})
  })

  describe('update event', () => {
    it('should store the updated event', () => {})
  })

  describe('delete event', () => {
    it('should remove the event', () => {})
  })
})
