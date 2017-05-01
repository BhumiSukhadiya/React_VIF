/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/customerRelationships              ->  index
 * POST    /api/customerRelationships              ->  create
 * GET     /api/customerRelationships/:id          ->  show
 * PUT     /api/customerRelationships/:id          ->  upsert
 * PATCH   /api/customerRelationships/:id          ->  patch
 * DELETE  /api/customerRelationships/:id          ->  destroy
 */

'use strict';

import CustomerRelationship from './customerRelationship.model';
import * as helper from '../../components/helper';

// Gets a list of CustomerRelationships
export function index(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const rooftopId = req.headers.rooftopid;
  return CustomerRelationship.find({rooftop: rooftopId}).exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Gets a single CustomerRelationship from the DB
export function show(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const rooftopId = req.headers.rooftopid;
  return CustomerRelationship.findOne({_id: req.params.id, rooftop: rooftopId}).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new CustomerRelationship in the DB
export function create(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  req.body.rooftop = req.headers.rooftopid;
  req.body.createdAt = Date.now();
  req.body.createdBy = req.user._id;
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return CustomerRelationship.create(req.body)
    .then(helper.respondWithResult(res, 201))
    .catch(helper.handleError(res));
}

// Upserts the given CustomerRelationship in the DB at the specified ID
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

  return CustomerRelationship.findOneAndUpdate({_id: req.params.id, rooftop: rooftopId}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()

    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Updates an existing CustomerRelationship in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return CustomerRelationship.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a CustomerRelationship from the DB
export function destroy(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  return CustomerRelationship.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
