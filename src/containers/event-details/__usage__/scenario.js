import React, { Component } from "react";

import EventDetails from "../EventDetails";
import { Button } from "react-bootstrap";

const guests = {
  "friedger.id": {
    name: "Friedger Müffke"
  }
};

const Scenario = () => {
  const { handleHide, deleteEvent, addEvent, updateEvent } = {
    handleHide: () => {
      console.log("HIDE");
    },
    deleteEvent: () => {
      console.log("DELETE");
    },
    addEvent: () => {
      console.log("ADD");
    },
    updateEvent: () => {
      console.log("UPDATE");
    }
  };
  return (
    <div>
      <EventDetails
        showModal={true}
        handleHide={handleHide}
        deleteEvent={deleteEvent}
        addEvent={addEvent}
        updateEvent={updateEvent}
        eventType="add"
        eventInfo={{
          slots: ["2018-12-31T23:00:00.000Z"],
          start: new Date("2018-12-31T23:00:00.000Z"),
          end: new Date("2018-12-31T23:00:00.000Z"),
          action: "click"
        }}
        newIndex={1}
      />
      <EventDetails
        showModal={true}
        handleHide={handleHide}
        deleteEvent={deleteEvent}
        addEvent={addEvent}
        updateEvent={updateEvent}
        eventType="edit"
        eventInfo={{
          slots: ["2018-12-31T23:00:00.000Z"],
          start: new Date("2018-12-31T23:00:00.000Z"),
          end: new Date("2018-12-31T23:00:00.000Z"),
          action: "click"
        }}
        newIndex={1}
      />
    </div>
  );
};

export default Scenario;
