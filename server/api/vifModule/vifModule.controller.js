/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/vifModules              ->  index
 * POST    /api/vifModules              ->  create
 * GET     /api/vifModules/:id          ->  show
 * PUT     /api/vifModules/:id          ->  upsert
 * PATCH   /api/vifModules/:id          ->  patch
 * DELETE  /api/vifModules/:id          ->  destroy
 */

'use strict';

import VifModule from './vifModule.model';
import * as helper from '../../components/helper';

// Gets a list of VifModules
export function index(req, res) {
  return VifModule.find().exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Gets a single VifModule from the DB
export function show(req, res) {
  return VifModule.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new VifModule in the DB
export function create(req, res) {
  req.body.createdAt = Date.now();
  req.body.createdBy = req.user._id;
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return VifModule.create(req.body)
    .then(helper.respondWithResult(res, 201))
    .catch(helper.handleError(res));
}

// Upserts the given VifModule in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return VifModule.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Updates an existing VifModule in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return VifModule.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a VifModule from the DB
export function destroy(req, res) {
  return VifModule.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
