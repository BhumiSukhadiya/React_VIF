/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/deskLogs              ->  index
 * POST    /api/deskLogs              ->  create
 * GET     /api/deskLogs/:id          ->  show
 * PUT     /api/deskLogs/:id          ->  upsert
 * PATCH   /api/deskLogs/:id          ->  patch
 * DELETE  /api/deskLogs/:id          ->  destroy
 */

'use strict';

import DeskLog from './deskLog.model';
import * as helper from '../../components/helper';


// Gets a list of DeskLogs
export function index(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  req.query.rooftopid = req.headers.rooftopid;

  let pagingParams = helper.getLazyLoadQueryConditions(req.query, DeskLog.schema);

  return DeskLog.count(pagingParams.condition)
    .exec()
    .then(count => {
      return DeskLog.find(pagingParams.condition)
        .skip(pagingParams.skip)
        .limit(pagingParams.limit)
        .sort(pagingParams.sort)
        .exec()
        .then(deskLog => {
          return res.status(200).json({deskLog: deskLog, total: count});
        });
    })
    .catch(helper.handleError(res));
}

// Gets a single DeskLog from the DB
export function show(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const rooftopId = req.headers.rooftopid;
  return DeskLog.findOne({_id: req.params.id, rooftop: rooftopId}).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new DeskLog in the DB
export function create(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  req.body.rooftop = req.headers.rooftopid;
  req.body.createdAt = Date.now();
  req.body.createdBy = req.user._id;
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return DeskLog.create(req.body)
    .then(helper.respondWithResult(res, 201))
    .catch(helper.handleError(res));
}

// Upserts the given DeskLog in the DB at the specified ID
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

  return DeskLog.findOneAndUpdate({_id: req.params.id, rooftop: rooftopId}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()

    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Updates an existing DeskLog in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return DeskLog.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a DeskLog from the DB
export function destroy(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  return DeskLog.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
