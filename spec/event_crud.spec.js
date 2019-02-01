var assert = require("assert");
var storeManager = require("../src/flow/store/storeManager");
var eventAction = require("../src/flow/store/event/eventAction");

const store = storeManager.createInitialStore({});

describe("CRUD Events", () => {
  describe("add private event", () => {
    it("should store a new private event", () => {
      store.dispatch(eventAction.addEvent({ title: "ABC" })).then(() => {
        const allEvents = store.getState().events.allEvents;
        assert.equal(
          allEvents,
          2,
          "Should contain default event and new event"
        );
        done();
      });
    });
  });
  describe("add public event", () => {
    it("should publish the event", () => {});
  });
  describe("update event", () => {
    it("should store the updated event", () => {});
  });
  describe("delete event", () => {
    it("should remove the event", () => {});
  });
});
