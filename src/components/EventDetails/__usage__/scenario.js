import React from 'react'

import EventDetails from '..'

const handleHide = () => {
  console.log('HIDE')
}

const deleteEvent = () => {
  console.log('DELETE')
}
const addEvent = () => {
  console.log('ADD')
}
const updateEvent = () => {
  console.log('UPDATE')
}
const loadGuestList = () => {
  console.log('LOAD GUEST LIST')
}

const GuestList = guests => {
  return <div>{JSON.stringify(guests)}</div>
}

const Scenario = () => {
  const eventToAdd = {
    eventType: 'add',
    eventInfo: {
      title: 'Event To Add',
      slots: ['2018-12-31T23:00:00.000Z'],
      start: new Date('2018-12-31T23:00:00.000Z'),
      end: new Date('2018-12-31T23:00:00.000Z'),
      action: 'click',
    },
    newIndex: 1,
  }
  const eventToEdit = {
    eventType: 'edit',
    eventInfo: {
      title: 'Event To Edit',
      slots: ['2018-12-31T23:00:00.000Z'],
      start: new Date('2018-12-31T23:00:00.000Z'),
      end: new Date('2018-12-31T23:00:00.000Z'),
      action: 'click',
    },
    newIndex: 1,
  }
  return (
    <div>
      <EventDetails
        handleHide={handleHide}
        deleteEvent={deleteEvent}
        addEvent={addEvent}
        updateEvent={updateEvent}
        loadGuestList={loadGuestList}
        GuestList={GuestList}
        {...eventToAdd}
      />
      <EventDetails
        handleHide={handleHide}
        deleteEvent={deleteEvent}
        addEvent={addEvent}
        updateEvent={updateEvent}
        loadGuestList={loadGuestList}
        GuestList={GuestList}
        {...eventToEdit}
      />
    </div>
  )
}

export default Scenario
