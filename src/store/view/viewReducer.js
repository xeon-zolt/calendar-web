import { SET_VIEW } from "../ActionTypes";

let initialState = {};

export default function reduce(state = initialState, action = {}) {
  let newState = state;
  let { type, payload } = action;
  switch (type) {
    case SET_VIEW:
      newState = { ...state, ...payload };
      break;
  }
  return newState;
}
