var assert = require('assert')
var storeManager = require('../src/flow/store/storeManager')
var eventActionLazy = require('../src/flow/store/event/eventActionLazy')

const store = storeManager.createInitialStore({})

describe('CRUD Events', () => {
  describe('add private event', () => {
    it('should store a new private event', () => {
      store
        .dispatch(
          eventActionLazy.addEvent({ title: 'Testing add private event' })
        )
        .then(() => {
          const allEvents = store.getState().events.allEvents
          assert.strict.equal(
            allEvents,
            2,
            'Should contain default event and new event'
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
