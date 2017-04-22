import axios from 'axios';
import config from '../config/base';

import cookie from 'react-cookie';
//set globally authorization header for each request
const AuthStr = 'Bearer '.concat(cookie.load('token'));
axios.defaults.headers.common['Authorization'] = AuthStr;
export const SET_TOKEN='SET_TOKEN';
export const SET_PARENT_COMPANY='SET_PARENT_COMPANY';
export const SET_ROOFTOP='SET_ROOFTOP';
export const SET_STATES='SET_STATES';
export const SET_PARENT_COMPANY_BY_ID='SET_PARENT_COMPANY_BY_ID';
export function setToken(auth_token){
  return {
    type:SET_TOKEN,
    auth_token
  }
}
export function login(user){
  return (dispatch) => {
    return axios.post(config.api_url+'auth/local', user)
      .then((res) => {
        if (res.status === 200) {
          alert('Login done successfully');
        }
        const token = res.data.token;
        cookie.save('token',token);
        dispatch(setToken(token));
        location.reload();
      }).catch(() => {
        alert('Login failed!Please try again.');
      });
  };
}
export function setParentCompanies(parentCompanies){
  return {
    type:SET_PARENT_COMPANY,
    parentCompanies
  }
}

export function getAllParentCompanies(id){
  //console.log(cookie.load('token'));
  return (dispatch) => {
    return axios.get(config.api_url+'api/parentCompanies')
      .then((res) => {
        dispatch(setParentCompanies(res.data));
      }).catch(() => {

      });
  };
}

export function setParentCompanyById(parentCompanyById){
  return {
    type:SET_PARENT_COMPANY_BY_ID,
    parentCompanyById
  }
}

export function getParentCompanyById(){
  //console.log(cookie.load('token'));
  return (dispatch) => {
    return axios.get(config.api_url+'api/parentCompanies')
      .then((res) => {
        dispatch(setParentCompanies(res.data));
      }).catch(() => {

      });
  };
}

export function getRooftop(parentId){
  return (dispatch) => {
    return axios.get(config.api_url+'api/rooftops/'+parentId+'/parentCompany')
  .then((res)=>{
  dispatch(setRooftop(res.data));
  })
  .catch((err)=>{alert(err)})
  };
}

export function setRooftop(rooftop){
  return {
    type:SET_ROOFTOP,
    rooftop
  }

}

export function setStates(states){
  return{
    type:SET_STATES,
    states
  }
}
export function getStates(){
  return (dispatch) => {
    return axios.get(config.api_url+'api/statePrefixes')
      .then((res) => {
        dispatch(setStates(res.data));
      }).catch(() => {

      });
  };
}
