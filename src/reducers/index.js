import { combineReducers } from 'redux';
import authentication from './AuthenticationReducer';
import headerData from './HeaderDataReducer';
import parentCompanyData from './ParentCompanyDataReducer';
// Combine all reducers into one root reducer
export default combineReducers({
  authentication,
  headerData,
  parentCompanyData
});
