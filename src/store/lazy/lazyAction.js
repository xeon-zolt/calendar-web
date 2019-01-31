import { SET_VIEW } from "../ActionTypes";
import { getViews } from "../../app/redux-lazy-loaded";
import { initializeEvents, initializeChat } from "../event/eventAction";

export function initializeLazy(store) {
  return async (dispatch, getState) => {
    store.dispatch({ type: SET_VIEW, payload: getViews(store) });
    store.dispatch(initializeEvents());
    store.dispatch(initializeChat());
  };
}
