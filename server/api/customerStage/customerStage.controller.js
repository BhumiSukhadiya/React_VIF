/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/customerStages              ->  index
 * POST    /api/customerStages              ->  create
 * GET     /api/customerStages/:id          ->  show
 * PUT     /api/customerStages/:id          ->  upsert
 * PATCH   /api/customerStages/:id          ->  patch
 * DELETE  /api/customerStages/:id          ->  destroy
 */

'use strict';

import CustomerStage from './customerStage.model';
import * as helper from '../../components/helper';

// Gets a list of CustomerStages
export function index(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const rooftopId = req.headers.rooftopid;
  return CustomerStage.find({rooftop: rooftopId}).exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Gets a single CustomerStage from the DB
export function show(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const rooftopId = req.headers.rooftopid;
  return CustomerStage.findOne({_id: req.params.id, rooftop: rooftopId}).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new CustomerStage in the DB
export function create(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  req.body.rooftop = req.headers.rooftopid;
  req.body.createdAt = Date.now();
  req.body.createdBy = req.user._id;
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return CustomerStage.create(req.body)
    .then(helper.respondWithResult(res, 201))
    .catch(helper.handleError(res));
}

// Upserts the given CustomerStage in the DB at the specified ID
export function upsert(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  if (req.body._id) {
    delete req.body._id;
  }
  const rooftopId = req.headers.rooftopid;
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return CustomerStage.findOneAndUpdate({_id: req.params.id, rooftop: rooftopId}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()

    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Updates an existing CustomerStage in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return CustomerStage.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a CustomerStage from the DB
export function destroy(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  return CustomerStage.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
