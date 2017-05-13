/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/rooftops              ->  index
 * POST    /api/rooftops              ->  create
 * GET     /api/rooftops/:id          ->  show
 * PUT     /api/rooftops/:id          ->  upsert
 * PATCH   /api/rooftops/:id          ->  patch
 * DELETE  /api/rooftops/:id          ->  destroy
 */

'use strict';

import Rooftop from './rooftop.model';
import rooftopHelper from './rooftop.helper';
import statePrefixHelper from '../statePrefix/statePrefix.helper';
import * as aws from '../../components/aws';
import * as helper from '../../components/helper';

// Gets a list of Rooftops
export function index(req, res) {
  return Rooftop.find().exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Gets a list of Rooftops of parent company
export function getAll(req, res) {
  if (!req.params.id) {
    return res.status(406).send({message: 'Please provide parent company id.'});
  }

  return Rooftop.find({'parentCompany': req.params.id}).exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Gets a single Rooftop from the DB
export function show(req, res) {
  return Rooftop.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new Rooftop in the DB
export function create(req, res) {
  console.log(req.body);
    if (!req.body.address ) {
        return res.status(406).json({message: 'Address is required.',obj:req.body});
    }
  if (!req.body.address.state) {
    return res.status(406).json({message: 'Address state is required.',obj:req.body});
  }

  let statePrefix = '';
  return statePrefixHelper.getByStateCode(req.body.address.state)
    .then(function (prefix) {
      if (!prefix) {
        return Promise.reject({code: 406, message: `State prefix not found for the state '${req.body.address.state}'`});
      }
      statePrefix = prefix.prefix;
      return rooftopHelper.getAllByStateCode(req.body.address.state);
    })
    .then(function (rooftops) {
      let nextId = 2001;
      rooftops.forEach(function (item) {
        let id = Number(item.dealerId.split('-')[1]);
        if (id >= nextId) {
          nextId = id + 1;
        }
      });

      req.body.dealerId = (('0' + statePrefix).slice(-2)).concat('-').concat(('000' + nextId).slice(-4));
      req.body.createdAt = Date.now();
      req.body.createdBy = req.user._id;
      req.body.updatedAt = Date.now();
      req.body.updatedBy = req.user._id;

      let rooftop = new Rooftop(req.body);
      if (req.files && req.files.file) {
        rooftop.logoImage = rooftop._id.toString().concat('.').concat(req.files.file.name.split('.').pop());
      }

      return rooftop.save();
    })
    .then(rooftop => {
      return Rooftop.findById(rooftop._id).exec();
    })
    .then(rooftop => {

      if (req.files && req.files.file) {
        let filePath = `dealerUploads/${rooftop.parentCompany.companyId}/${rooftop.dealerId}/`;
        return aws.uploadImage(req.files.file, filePath, rooftop.logoImage, rooftop);
      } else {
        return Promise.resolve(rooftop);
      }
    })
    .then(rooftop => {
      if (!rooftop) {
        return res.status(500).end();
      }
      return res.status(200).json(rooftop);
    })
    .catch(error => {
      return res.status(error.code || 500).json(error);
    });
}

// Upserts the given Rooftop in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  if (req.files && req.files.file) {
    req.body.logoImage = req.params.id.toString().concat('.').concat(req.files.file.name.split('.').pop());
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return Rooftop.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()
    .then(rooftop => {
      return Rooftop.findById(rooftop._id).exec();
    })
    .then(rooftop => {
      if (req.files && req.files.file) {
        let filePath = `dealerUploads/${rooftop.parentCompany.companyId}/${rooftop.dealerId}/`;
        return aws.uploadImage(req.files.file, filePath, rooftop.logoImage, rooftop);
      } else {
        return Promise.resolve(rooftop);
      }
    })
    .then(rooftop => {
      if (!rooftop) {
        return res.status(500).send({message: 'The server encountered an internal error and was unable to complete your request. Please contact administrator.'});
      }
      return res.status(200).json(rooftop);
    })
    .catch(helper.handleError(res));
}

// Updates an existing Rooftop in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return Rooftop.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a Rooftop from the DB
export function destroy(req, res) {
  return Rooftop.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
