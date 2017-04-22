/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/parentCompanies              ->  index
 * POST    /api/parentCompanies              ->  create
 * GET     /api/parentCompanies/:id          ->  show
 * PUT     /api/parentCompanies/:id          ->  upsert
 * PATCH   /api/parentCompanies/:id          ->  patch
 * DELETE  /api/parentCompanies/:id          ->  destroy
 */

'use strict';

import ParentCompany from './parentCompany.model';
import parentCompanyHelper from './parentCompany.helper';
import statePrefixHelper from '../statePrefix/statePrefix.helper';
import * as helper from '../../components/helper';

// Gets a list of ParentCompanies
export function index(req, res) {
  return ParentCompany.find().exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Gets a single ParentCompany from the DB
export function show(req, res) {
  return ParentCompany.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new ParentCompany in the DB
export function create(req, res) {
  if (!req.body.address || !req.body.address.state) {
    return res.status(405).send({message: 'Address state is required.'});
  }

  let statePrefix = '';
  return statePrefixHelper.getByStateCode(req.body.address.state)
    .then(function (prefix) {
      if (!prefix) {
        return Promise.reject({message: `State prefix not found for the state '${req.body.address.state}'`});
      }

      statePrefix = prefix.prefix;
      return parentCompanyHelper.getAllByStateCode(req.body.address.state);
    })
    .then(function (parentCompanies) {
      let nextId = 1;
      parentCompanies.forEach(function (item) {
        let id = Number(item.companyId.split('-')[1]);
        if (id >= nextId) {
          nextId = id + 1;
        }
      });

      req.body.companyId = (('0' + statePrefix).slice(-2)).concat('-').concat(('000' + nextId).slice(-4));
      req.body.createdAt = Date.now();
      req.body.createdBy = req.user._id;
      req.body.updatedAt = Date.now();
      req.body.updatedBy = req.user._id;

      return ParentCompany.create(req.body)
        .then(helper.respondWithResult(res, 201))
    })
    .catch(error => res.status(error.code || 500).json(error));
}

// Upserts the given ParentCompany in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  if (req.body.companyId) {
    delete req.body.companyId;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return ParentCompany.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Updates an existing ParentCompany in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  if (req.body.companyId) {
    delete req.body.companyId;
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return ParentCompany.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a ParentCompany from the DB
export function destroy(req, res) {
  return ParentCompany.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
