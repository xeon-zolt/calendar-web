import React, { Component } from 'react'

import { Button, Glyphicon, Panel } from 'react-bootstrap'

const File = props => {
  const { url, name, ics } = props
  return (
    <div>
      <a href={url}>{name}</a>
      {ics && (
        <span>
          &nbsp;
          <a href={ics}>{name}.ics</a>
        </span>
      )}
    </div>
  )
}

export class Export extends Component {
  render() {
    const { files } = this.props
    return (
      <Panel style={{ margin: '10px' }}>
        <Panel.Heading>
          <label variant="title">
            Your remote files on {files.appBucketUrl}
          </label>
          <Button variant="contained" size="small">
            <Glyphicon glyph="refresh" />
            Refresh
          </Button>
        </Panel.Heading>
        <Panel.Body>
          <label variant="display1">Calendar Files</label>

          {files.calendarListFile && (
            <File name="Calendar List File" url={files.calendarListFile} />
          )}

          {files.contactFileList && (
            <File name="Contact List File" url={files.contactFileList} />
          )}
          {Object.keys(files.calendars).map(k => {
            return (
              <File
                key={k}
                name={files.calendars[k][0].name}
                url={files.calendars[k][0].url}
                ics={files.calendars[k][0].ics}
              />
            )
          })}
          {files.sharedEvents && files.sharedEvents.length > 0 && (
            <div>
              <label variant="display1">Shared Events</label>
              {files.sharedEvents.map((v, k) => {
                return <File key={k} name={v.name} url={v.url} />
              })}
            </div>
          )}
          {files.others && files.others.length > 0 && (
            <div>
              <label variant="display1">Other Files</label>
              {files.others.map((v, k) => {
                return <File key={k} name={v.name} url={v.url} />
              })}
            </div>
          )}
        </Panel.Body>
      </Panel>
    )
  }
}
