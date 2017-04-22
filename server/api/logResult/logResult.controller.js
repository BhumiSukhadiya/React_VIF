/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/logResults              ->  index
 * POST    /api/logResults              ->  create
 * GET     /api/logResults/:id          ->  show
 * PUT     /api/logResults/:id          ->  upsert
 * PATCH   /api/logResults/:id          ->  patch
 * DELETE  /api/logResults/:id          ->  destroy
 */

'use strict';

import LogResult from './logResult.model';
import * as aws from '../../components/aws';
import * as helper from '../../components/helper';

// Gets a list of LogResults
export function index(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const rooftopId = req.headers.rooftopid;
  return LogResult.find({rooftop: rooftopId}).exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Gets a single LogResult from the DB
export function show(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  const rooftopId = req.headers.rooftopid;
  return LogResult.findOne({_id: req.params.id, rooftop: rooftopId}).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new LogResult in the DB
export function create(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  req.body.createdAt = Date.now();
  req.body.createdBy = req.user._id;
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;
  req.body.rooftop = req.headers.rooftopid;

  var logResult = new LogResult(req.body);
  if (req.files && req.files.file) {
    logResult.resultImage = logResult._id.toString().concat('.').concat(req.files.file.name.split('.').pop());
  }

  return logResult.save()
    .then(logResult => {
      return LogResult.findById(logResult._id).exec();
    })
    .then(logResult => {
      if (req.files && req.files.file) {
        let filePath = `dealerUploads/${logResult.rooftop.parentCompany.companyId}/${logResult.rooftop.dealerId}/results/`;
        return aws.uploadImage(req.files.file, filePath, logResult.resultImage, logResult);
      } else {
        return Promise.resolve(logResult);
      }
    })
    .then(logResult => {
      return LogResult.findById(logResult._id).exec();
    })
    .then(logResult => {
      if (!logResult) {
        return res.status(500).end();
      }
      return res.status(200).json(logResult);
    })
    .catch(helper.handleError(res));
}

// Upserts the given LogResult in the DB at the specified ID
export function upsert(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  if (req.body._id) {
    delete req.body._id;
  }
  const rooftopId = req.headers.rooftopid;

  if (req.files && req.files.file) {
    req.body.resultImage = req.params.id.toString().concat('.').concat(req.files.file.name.split('.').pop());
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return LogResult.findOneAndUpdate({_id: req.params.id, rooftop: rooftopId}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()
    .then(logResult => {
      return LogResult.findById(logResult._id).exec();
    })
    .then(logResult => {
      if (req.files && req.files.file) {
        let filePath = `dealerUploads/${logResult.rooftop.parentCompany.companyId}/${logResult.rooftop.dealerId}/results/`;
        return aws.uploadImage(req.files.file, filePath, logResult.resultImage, logResult);
      } else {
        return Promise.resolve(logResult);
      }
    })
    .then(logResult => {
      return LogResult.findById(logResult._id).exec();
    })
    .then(logResult => {
      if (!logResult) {
        return res.status(500).end();
      }
      return res.status(200).json(logResult);
    })
    .catch(helper.handleError(res));
}

// Updates an existing LogResult in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return LogResult.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a LogResult from the DB
export function destroy(req, res) {
  return LogResult.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
