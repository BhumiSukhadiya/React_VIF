'use strict';

import * as helper from '../../../components/helper';
import * as nhtsa from "../../../components/utilities/NHTSA";

export function getMakes(req, res) {
  return nhtsa.getAllMakes()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

export function getModels(req, res) {
  return nhtsa.getModelsByMake(req.params.make)
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

export function decodeVin(req, res) {
  return nhtsa.decodeVehicle(req.params.vin)
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}
