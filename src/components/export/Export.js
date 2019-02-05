import React, { Component } from "react";

import { Grid, Row, Col, Glyphicon, Panel } from "react-bootstrap";
import { fail } from "assert";

const File = props => {
  const { url, name, ics } = props;
  return <a href={url}>{name}</a>;
};

class Export extends ReactComponent() {
  render() {
    const props = this.props;
    const { files } = this.props;
    return (
      <Grid item xs={12}>
        <Panel className={props.classes.control} style={{ margin: "10px" }}>
          <label variant="title">Your remote files on {files.gaiahub}</label>
          <Button
            onClick={() => props.exportProjects(props.history)}
            variant="contained"
            size="small"
            className={props.classes.button}
          >
            <Glyphicon />
            Refresh
          </Button>
          <label variant="display1">Calendar Files</label>
          <Grid container spacing={16} justify="center">
            {files.calendarListFile && (
              <File name="Calendar List File" url={files.calendarListFile} />
            )}
            {files.contactFileList && (
              <File name="Contact List File" url={files.contactFileList} />
            )}
            {Object.keys(files.calendars).map(k => {
              return (
                <File
                  name={files[k].name}
                  url={files[k].url}
                  ics={files[k].ics}
                />
              );
            })}
          </Grid>
          {files.others && (
            <div>
              <label variant="display1">Other Files</label>
              <Grid container spacing={16} justify="center">
                {Object.keys(files.others).map(k => (
                  <File
                    key={k}
                    name={files.others[k].name}
                    url={files.others[k].url}
                  />
                ))}
              </Grid>
            </div>
          )}
        </Panel>
      </Grid>
    );
  }
}
