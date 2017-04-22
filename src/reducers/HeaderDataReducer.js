import { SET_PARENT_COMPANY,SET_ROOFTOP} from '../actions';

const HeaderDataReducer = (state = null, action) => {
  switch (action.type) {
     case SET_PARENT_COMPANY:
      return {
        ...state,
        parentCompanies: action.parentCompanies
      };
    case SET_ROOFTOP:
      return {
        ...state,
        rooftop: action.rooftop
      };

    default:
      return {...state};
  }
};


// Export Reducer
export default HeaderDataReducer;
