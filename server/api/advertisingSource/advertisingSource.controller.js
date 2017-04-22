/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/advertisingSources              ->  index
 * POST    /api/advertisingSources              ->  create
 * GET     /api/advertisingSources/:id          ->  show
 * PUT     /api/advertisingSources/:id          ->  upsert
 * PATCH   /api/advertisingSources/:id          ->  patch
 * DELETE  /api/advertisingSources/:id          ->  destroy
 */

'use strict';

import AdvertisingSource from './advertisingSource.model';
import * as helper from '../../components/helper';

// Gets a list of AdvertisingSources
export function index(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const rooftopId = req.headers.rooftopid;
  return AdvertisingSource.find({rooftop: rooftopId}).exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Gets a single AdvertisingSource from the DB
export function show(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const rooftopId = req.headers.rooftopid;
  return AdvertisingSource.findOne({_id: req.params.id, rooftop: rooftopId}).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new AdvertisingSource in the DB
export function create(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  req.body.rooftop = req.headers.rooftopid;
  req.body.createdAt = Date.now();
  req.body.createdBy = req.user._id;
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return AdvertisingSource.create(req.body)
    .then(helper.respondWithResult(res, 201))
    .catch(helper.handleError(res));
}

// Upserts the given AdvertisingSource in the DB at the specified ID
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

  return AdvertisingSource.findOneAndUpdate({_id: req.params.id, rooftop: rooftopId}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Updates an existing AdvertisingSource in the DB
export function patch(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  if (req.body._id) {
    delete req.body._id;
  }

  req.body.updatedAt = Date.now;
  req.body.updatedBy = req.user._id;

  return AdvertisingSource.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a AdvertisingSource from the DB
export function destroy(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  return AdvertisingSource.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
