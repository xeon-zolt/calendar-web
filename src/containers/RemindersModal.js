import { connect } from 'react-redux'

import { unsetRemindersInfoRequest } from '../store/event/eventActionLazy'
import RemindersModal from '../components/Calendar/RemindersModal'

export default connect(
  state => {
    console.log('[ConnectedRemindersModal]', state)
    return {}
  },
  dispatch => {
    return {
      handleRemindersHide: () => {
        dispatch(unsetRemindersInfoRequest())
      },
    }
  }
)(RemindersModal)
