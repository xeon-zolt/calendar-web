import React from 'react'
import AddDeleteSetting from './AddDeleteSetting'

const LINK_URL_BASE = 'https://debutapp.social/'

const ContactItem = props => {
  const { item, onItemChanged } = props
  const { image, username, name } = item.image
  const linkUrl = LINK_URL_BASE + username
  var avatarUrl
  if (image && image.length > 0 && image[0].contentUrl) {
    avatarUrl = image[0].contentUrl
  }
  return (
    <div>
      <input
        type="checkbox"
        checked={item.selected}
        value={item.selected}
        onChange={e => onItemChanged(e, 'delete')}
      />
      {avatarUrl && (
        <img src={avatarUrl} height="16px" width="16px" alt="avatar" />
      )}
      {!avatarUrl && <span className="glyphicon glyphicon-user" />}
      <a href={linkUrl}>{name || username}</a>
    </div>
  )
}

export default class Contacts extends AddDeleteSetting {
  constructor(props) {
    super(props)
    this.state.addPlaceholder = 'e.g. alice.id or bob.id.blockstack'

    this.state.ItemRenderer = ContactItem

    this.state.addValueToItem = (valueOfAdd, asyncReturn) => {
      const { lookupContacts, items: contacts } = this.props
      const contactQuery = valueOfAdd
      console.log('contactQuery', contactQuery)

      // check if contact already in
      const uids = (contacts || []).map(d => d.uid)
      if (uids.includes(contactQuery)) {
        asyncReturn({ error: 'already in' })
      } else {
        console.log('lookupContacts', contactQuery)
        lookupContacts(contactQuery).then(
          proposedContacts => {
            console.log('proposedContacts', proposedContacts)
            asyncReturn({ result: proposedContacts })
          },
          error => {
            console.log('error', error)
            asyncReturn({ error })
          }
        )
      }
    }
  }
}
