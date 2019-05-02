import React, { Component } from 'react'

import Export from './Export'

class Scenario extends Component {
  constructor(props) {
    super(props)
    this.state({
      files: {
        gaiahub: 'https://gaia.blockstack.org/something',
        calendarListFile: 'https://gaia.blockstack.org/something/Contacts',
        contactListFile: 'https://gaia.blockstack.org/something/Contacts',
        calendars: {
          private: [
            {
              name: 'default',
              url: 'https://gaia.blockstack.org/something/default/AllEvents',
            },
          ],
          public: [
            {
              name: 'public',
              url: 'https://gaia.blockstack.org/something/public/AllEvents',
              icsurl:
                'https://gaia.blockstack.org/something/public/AllEvents.ics',
            },
          ],
        },
        others: [
          {
            name: 'anotherfile',
            url: 'https://gaia.blockstack.org/something/anotherfile.txt',
          },
        ],
      },
    })
  }

  render() {
    const { files } = this.state
    return (
      <div>
        <Export file={files} />
      </div>
    )
  }
}

export default Scenario
