import { SET_TOKEN} from '../actions';

const AuthenticationReducer = (state = null, action) => {
  switch (action.type) {
    case SET_TOKEN :
      return {
        ...state,
        token: action.auth_token
      };

    default:
      return {...state};
  }
};


// Export Reducer
export default AuthenticationReducer;
