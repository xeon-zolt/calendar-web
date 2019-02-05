import React from 'react'
import AddDeleteSetting from './AddDeleteSetting'

const LINK_URL_BASE = 'https://debutapp.social/'

const ContactItem = props => {
  const { contact, handleDataChange } = props
  const linkUrl = LINK_URL_BASE + contact.username
  var avatarUrl
  if (
    contact.image &&
    contact.image.length > 0 &&
    contact.image[0].contentUrl
  ) {
    avatarUrl = contact.image[0].contentUrl
  }
  var name = contact.name
  if (!name) {
    name = contact.username
  }
  return (
    <div>
      <input
        type="checkbox"
        checked={contact.selected}
        value={contact.selected}
        onChange={e => handleDataChange(e, 'delete')}
      />
      {avatarUrl && (
        <img src={avatarUrl} height="16px" width="16px" alt="avatar" />
      )}
      {!avatarUrl && <span className="glyphicon glyphicon-user" />}
      <a href={linkUrl}>{name}</a>
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
