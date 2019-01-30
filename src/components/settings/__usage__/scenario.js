import React, { Component } from "react";

import { Calendars } from "../Calendars";
import { Contacts } from "../Contacts";

const Scenario = () => {
  const calendars = [
    {
      type: "private",
      name: "default",
      active: true,
      data: { src: "default/AllEvents" }
    },
    {
      type: "blockstack-user",
      name: "public@friedger.id",
      mode: "read-only",
      active: false,
      hexColor: "#FF0000",
      data: { user: "friedger.id", src: "public/AllEvents" }
    }
  ];

  const contacts = {
    "friedger.id": { roomId: "!oTPxgFhouwHiEGwIpQ:openintents.modular.im" },
    "pipppapp.id.blockstack": {
      roomId: "!vqrdwZGrwdDkQdGgnH:openintents.modular.im"
    }
  };

  return (
    <div>
      <Calendars calendars={calendars} />
      <Contacts contacts={contacts} />
    </div>
  );
};

export default Scenario;
