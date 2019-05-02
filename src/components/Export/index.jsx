import React, { memo, Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// File Component
import File from './File'

class Files extends Component {
	componentDidMount() {
		const { files, refreshFiles } = this.props
		if (!files.calendars) {
			refreshFiles()
		}
	}

	render() {
		const { files, refreshFiles } = this.props
		console.log('files', files)

		if (!files.calendars) {
			return (
				<Card style={{ margin: '10px' }}>
					<Card.Header>Loading</Card.Header>
				</Card>
			)
		}

		return (
			<Card style={{ margin: '10px' }}>
				<Card.Header>
					<label variant="title">
						Remote files on{' '}
						<a href="https://docs.blockstack.org/browser/storage-provider.html">
							your storage
						</a>
					</label>
					<Button
						variant="contained"
						size="small"
						onClick={() => refreshFiles()}
					>
						<FontAwesomeIcon icon="sync" />
					</Button>
				</Card.Header>
				<Card.Body style={{ textAlign: 'left' }}>
					<div>
						<label variant="display1">
							Storage Location: {files.appBucketUrl}
						</label>
					</div>
					<label variant="display1">Calendar Files</label>

					{files.calendarListFile && (
						<File name="Calendar List File" url={files.calendarListFile} />
					)}

					{files.contactFileList && (
						<File name="Contact List File" url={files.contactFileList} />
					)}

					{Object.keys(files.calendars).map(k => {
						console.log(files.calendars[k])
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

					{files.msgs && files.msgs.length > 0 && (
						<div>
							<label variant="display1">Chat Messages</label>
							{files.msgs.map((v, k) => {
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
				</Card.Body>
			</Card>
		)
	}
}

Files.propTypes = {
	files: PropTypes.any,
	refreshFiles: PropTypes.func,
}

export default memo(Files)
