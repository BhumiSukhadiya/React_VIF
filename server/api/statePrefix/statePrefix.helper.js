'use strict';

import StatePrefix from './statePrefix.model';

// Gets a single StatePrefix by state abbreviation from the DB
function getByStateCode(stateCode) {
  return StatePrefix
    .findOne({abbreviation: stateCode})
    .exec()
    .then(prefix => Promise.resolve(prefix))
    .catch(error => Promise.reject(error));
}

export default {
  getByStateCode: getByStateCode
};
