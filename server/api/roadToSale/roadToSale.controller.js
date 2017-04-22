/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/roadToSale              ->  index
 * POST    /api/roadToSale              ->  create
 * GET     /api/roadToSale/:id          ->  show
 * PUT     /api/roadToSale/:id          ->  upsert
 * PATCH   /api/roadToSale/:id          ->  patch
 * DELETE  /api/roadToSale/:id          ->  destroy
 */

'use strict';

import RoadToSale from './roadToSale.model';
import * as helper from '../../components/helper';


// Gets a list of RoadToSales
export function index(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const rooftopId = req.headers.rooftopid;
  return RoadToSale.find({rooftop: rooftopId})
    .sort({stepPosition: 1})
    .exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

export function getMaxStepPosition(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const rooftopId = req.headers.rooftopid;
  return RoadToSale.findOne({rooftop: rooftopId})
    .sort({stepPosition: -1})
    .exec()
    .then(roadToSale => res.status(200).json({newStepPosition: roadToSale ? (roadToSale.stepPosition + 1) : 1}))
    .catch(helper.handleError(res));
}

// Gets a single RoadToSale from the DB
export function show(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const rooftopId = req.headers.rooftopid;
  return RoadToSale.findOne({_id: req.params.id, rooftop: rooftopId}).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new RoadToSale in the DB
export function create(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  req.body.rooftop = req.headers.rooftopid;
  req.body.createdAt = Date.now();
  req.body.createdBy = req.user._id;
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return RoadToSale.create(req.body)
    .then(helper.respondWithResult(res, 201))
    .catch(helper.handleError(res));
}

// Upserts the given RoadToSale in the DB at the specified ID
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
  return RoadToSale.findOneAndUpdate({_id: req.params.id, rooftop: rooftopId}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

export function changeOrder(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const roadToSale = req.body;
  const rooftopId = req.headers.rooftopid;
  return updateRoadToSaleOrder(roadToSale, 0, req.user._id, rooftopId)
    .then(data => RoadToSale.find()
      .sort({stepPosition: 1})
      .exec()
      .then(helper.respondWithResult(res)))
    .catch(helper.handleError(res));
}

function updateRoadToSaleOrder(roadToSale, index, userId, rooftopId) {
  return RoadToSale.findOneAndUpdate({_id: JSON.parse(roadToSale[index])._id, rooftop: rooftopId}, {
    stepPosition: index + 1,
    updatedAt: Date.now(),
    updatedBy: userId
  }, {
    upsert: true,
    runValidators: true
  }).exec()
    .then(data => {
      index++;
      if (index < roadToSale.length) {
        return updateRoadToSaleOrder(roadToSale, index, userId, rooftopId);
      }
    });
}

// Updates an existing RoadToSale in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;
  return RoadToSale.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a RoadToSale from the DB
export function destroy(req, res) {
  return RoadToSale.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
