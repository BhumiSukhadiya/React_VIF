'use strict';

import request from 'request-promise';
import util from 'util';
import _ from 'lodash';

function makeRequest(queryString) {
  const option = {
    method: 'GET',
    uri: util.format('%s/%s?format=json', global.applicationSettings.decodeVehicleApiUrl, queryString),
    json: true
  };

  return request(option);
}

export function getAllMakes() {
  return makeRequest('getAllMakes')
    .then(data => {
      if (data && data.Results){
        data = data.Results;
        return Promise.resolve(_.map(data, 'Make_Name'));
      }

      return Promise.resolve([]);
    })
    .catch(err => Promise.reject(err));
}

export function getModelsByMake(makeName) {
  return makeRequest(util.format('getModelsForMake/%s', makeName))
    .then(data => {
      if (data && data.Results){
        data = data.Results;
        return Promise.resolve(_.map(data, 'Model_Name'));
      }

      return Promise.resolve([]);
    })
    .catch(err => Promise.reject(err));
}

export function decodeVehicle(vin) {
  return makeRequest(util.format('decodeVinValues/%s', vin))
    .then(data => {
      if (data && data.Results){
        data = data.Results[0];
        if(data.Make && data.Model) {
          return Promise.resolve(data);
        }
      }

      return Promise.resolve(null);
    })
    .catch(err => Promise.reject(err));
}
