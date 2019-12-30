import produce from 'immer';

const INITIAL_STATE = {
  administrator: null,
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@auth/SIGN_IN_SUCCESS':
      return produce(state, draft => {
        draft.administrator = action.payload.user;
      });
    default:
      return state;
  }
}
