import { SET_STATES} from '../actions';

const ParentCompanyDataReducer = (state = null, action) => {
  switch (action.type) {
    case SET_STATES:
      return {
        ...state,
        states: action.states
      };

    default:
      return {...state};
  }
};


// Export Reducer
export default ParentCompanyDataReducer;
