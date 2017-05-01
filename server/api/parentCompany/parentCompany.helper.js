'use strict';

import ParentCompany from './parentCompany.model';

// Gets all ParentCompany by state abbreviation from the DB
function getAllByStateCode(stateCode) {
  return ParentCompany
    .find({'address.state' : stateCode})
    .exec()
    .then(parentCompanies => Promise.resolve(parentCompanies))
    .catch(error => Promise.reject(error));
}

export default {
  getAllByStateCode: getAllByStateCode
};
