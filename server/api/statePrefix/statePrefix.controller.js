/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/statePrefixes              ->  index
 * POST    /api/statePrefixes              ->  create
 * GET     /api/statePrefixes/:id          ->  show
 * PUT     /api/statePrefixes/:id          ->  upsert
 * PATCH   /api/statePrefixes/:id          ->  patch
 * DELETE  /api/statePrefixes/:id          ->  destroy
 */

'use strict';

import StatePrefix from './statePrefix.model';
import * as helper from '../../components/helper';

// Gets a list of StatePrefixes
export function index(req, res) {
  return StatePrefix.find()
    .sort({state: 1})
    .exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Gets a single StatePrefix from the DB
export function show(req, res) {
  return StatePrefix.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new StatePrefix in the DB
export function create(req, res) {
  req.body.createdAt = Date.now();
  req.body.createdBy = req.user._id;
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return StatePrefix.create(req.body)
    .then(helper.respondWithResult(res, 201))
    .catch(helper.handleError(res));
}

// Upserts the given StatePrefix in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return StatePrefix.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Updates an existing StatePrefix in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return StatePrefix.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a StatePrefix from the DB
export function destroy(req, res) {
  return StatePrefix.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
