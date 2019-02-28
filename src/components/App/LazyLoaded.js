// views
import EventDetails from '../EventDetails'
import GuestList from '../EventGuestList'
import UserProfile from '../UserProfile'
import { connectToStore } from './_FN'
import { SET_LAZY_VIEW } from '../../store/ActionTypes'

// flow
import connectEventDetails from '../../containers/EventDetails'
import connectGuestList from '../../containers/GuestList'
import connectUserProfile from '../../containers/UserProfile'

import {
  initializeLazyActions,
  initializeChat,
} from '../../store/event/eventActionLazy'

export function initializeLazy(store) {
  store.dispatch({
    type: SET_LAZY_VIEW,
    payload: {
      EventDetails: connectToStore(EventDetails, connectEventDetails, store),
      GuestList: connectToStore(GuestList, connectGuestList, store),
      UserProfile: connectToStore(UserProfile, connectUserProfile, store),
    },
  })
  store.dispatch(initializeLazyActions())
  store.dispatch(initializeChat())
}
