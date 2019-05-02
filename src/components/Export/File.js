import React, { memo } from 'react'
import PropTypes from 'prop-types'

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

File.propTypes = {
  ics: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
}

export default memo(File)
