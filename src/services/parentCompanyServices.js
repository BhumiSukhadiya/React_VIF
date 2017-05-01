import axios from 'axios';
import config from '../config/base';
export function addParentCompany(parentCompanyData) {
  return axios.post(config.api_url+'api/parentCompanies/', parentCompanyData).then();
}

export function getStates() {
  return axios.get(config.api_url+'api/statePrefixes').then();
}

export function updateParentCompany(id, parentCompanyData) {
  return axios.put(config.api_url+'api/parentCompanies/' + id, parentCompanyData);
}

export function getParentCompanies() {
  return axios.get(config.api_url+'api/parentCompanies/').then();
}

export function isEmpty( o ) {
  for ( var p in o ) {
    if ( o.hasOwnProperty( p ) ) { return false; }
  }
  return true;
}
