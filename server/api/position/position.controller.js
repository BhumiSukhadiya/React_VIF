/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/positions              ->  index
 * POST    /api/positions              ->  create
 * GET     /api/positions/:id          ->  show
 * PUT     /api/positions/:id          ->  upsert
 * PATCH   /api/positions/:id          ->  patch
 * DELETE  /api/positions/:id          ->  destroy
 */

'use strict';

import Position from './position.model';
import * as helper from '../../components/helper';

// Gets a list of Positions
export function index(req, res) {
  return Position.find().exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Gets a single Position from the DB
export function show(req, res) {
  return Position.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new Position in the DB
export function create(req, res) {
  req.body.createdAt = Date.now();
  req.body.createdBy = req.user._id;
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return Position.create(req.body)
    .then(helper.respondWithResult(res, 201))
    .catch(helper.handleError(res));
}

// Upserts the given Position in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return Position.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Updates an existing Position in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return Position.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a Position from the DB
export function destroy(req, res) {
  return Position.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
