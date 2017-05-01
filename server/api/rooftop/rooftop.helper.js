'use strict';

import Rooftop from './rooftop.model';

// Gets dealer connection string from DB
export function getConnectionString(rooftopId) {
  return Rooftop.findById(rooftopId).select('parentCompany dealerId connectionString').exec();
}

// Gets all Rooftop by state abbreviation from the DB
function getAllByStateCode(stateCode) {
  return Rooftop
    .find({'address.state' : stateCode})
    .exec()
    .then(rooftops => Promise.resolve(rooftops))
    .catch(error => Promise.reject(error));
}

export default {
  getAllByStateCode: getAllByStateCode
};
