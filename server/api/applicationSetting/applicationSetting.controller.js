/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/applicationSettings              ->  index
 * POST    /api/applicationSettings              ->  create
 * GET     /api/applicationSettings/:id          ->  show
 * PUT     /api/applicationSettings/:id          ->  upsert
 * PATCH   /api/applicationSettings/:id          ->  patch
 * DELETE  /api/applicationSettings/:id          ->  destroy
 */

'use strict';

import ApplicationSetting from './applicationSetting.model';
import * as helper from '../../components/helper';

// Gets a list of ApplicationSettings
export function index(req, res) {
  return ApplicationSetting.find().exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Gets a single ApplicationSetting from the DB
export function show(req, res) {
  return ApplicationSetting.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new ApplicationSetting in the DB
export function create(req, res) {
  req.body.createdAt = Date.now();
  req.body.createdBy = req.user._id;
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return ApplicationSetting.create(req.body)
    .then(helper.respondWithResult(res, 201))
    .catch(helper.handleError(res));
}

// Upserts the given ApplicationSetting in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return ApplicationSetting.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Updates an existing ApplicationSetting in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return ApplicationSetting.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a ApplicationSetting from the DB
export function destroy(req, res) {
  return ApplicationSetting.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
