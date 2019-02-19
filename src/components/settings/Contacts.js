import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import AddDeleteSetting from './AddDeleteSetting'

const LINK_URL_BASE = 'https://debutapp.social/'

const ContactItem = props => {
  const { item, user } = props
  let { image, username, name } = item
  const linkUrl = LINK_URL_BASE + username
  let avatarUrl

  if (image && image.length > 0 && image[0].contentUrl) {
    avatarUrl = image[0].contentUrl
  }

  if (user && user.username && user.username === username) {
    name = 'You (' + username + ')'
  }

  return (
    <>
      {avatarUrl && (
        <img src={avatarUrl} height="16px" width="16px" alt="avatar" />
      )}
      {!avatarUrl && <FontAwesomeIcon icon="user-circle" />}
      <a style={{ marginLeft: 4 }} href={linkUrl}>
        {name || username}
      </a>
    </>
  )
}

export default class Contacts extends AddDeleteSetting {
  constructor(props) {
    super(props)
    const addPlaceholder = 'e.g. alice.id or bob.id.blockstack'

    this.state.ItemRenderer = ContactItem
    this.state.addTitle = 'Add Contact'
    this.state.listTitle = 'Contacts'
    this.state.showFollow = true
    this.state.addValueToItem = (valueOfAdd, asyncReturn) => {
      const { items: contacts } = this.props
      const contactQuery = valueOfAdd
      console.log('contactQuery', contactQuery)

      // check if contact already in
      const usernames = Object.keys(contacts || {})
      if (usernames.includes(contactQuery)) {
        asyncReturn({ error: 'already in' })
      } else {
        asyncReturn({ item: { username: contactQuery } })
      }
    }

    this.state.renderAdd = () => {
      return (
        <input
          placeholder={addPlaceholder}
          type="text"
          value={this.state.valueOfAdd}
          onChange={this.bound2.onAddValueChange}
          style={{ width: '80%' }}
        />
      )
    }

    this.bound2 = ['onAddValueChange'].reduce((acc, d) => {
      acc[d] = this[d].bind(this)
      delete this[d]
      return acc
    }, {})
  }
}
