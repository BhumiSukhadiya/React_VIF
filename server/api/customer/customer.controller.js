/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/customers              ->  index
 * POST    /api/customers              ->  create
 * GET     /api/customers/:id          ->  show
 * PUT     /api/customers/:id          ->  upsert
 * PATCH   /api/customers/:id          ->  patch
 * DELETE  /api/customers/:id          ->  destroy
 */

'use strict';

import constants from '../../config/constants';
import Customer from './customer.model';
import {getInventory} from '../dealer/inventory/inventory.helper';
import {saveCustomerVehicle} from './customer.helper';
import * as helper from '../../components/helper';
import * as aws from '../../components/aws';

// Gets a list of Customers
export function index(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: constants.ERRORS.SELECT_ROOFTOP});
  }
  req.query.rooftopid = req.headers.rooftopid;

  let pagingParams = helper.getLazyLoadQueryConditions(req.query, Customer.schema);
  return Customer.count(pagingParams.condition)
    .exec()
    .then(count => {
      return Customer.find(pagingParams.condition)
        .skip(pagingParams.skip)
        .limit(pagingParams.limit)
        .sort(pagingParams.sort)
        .exec()
        .then(customers => {
          return res.status(200).json({customers: customers, total: count});
        });
    })
    .catch(helper.handleError(res));
}

// Gets a single Customer from the DB
export function show(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: constants.ERRORS.SELECT_ROOFTOP});
  }
  const rooftopId = req.headers.rooftopid;
  return Customer.findOne({_id: req.params.id, rooftop: rooftopId}).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new Customer in the DB
export function create(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: constants.ERRORS.SELECT_ROOFTOP});
  }
  req.body.rooftop = req.headers.rooftopid;
  req.body.createdAt = Date.now();
  req.body.createdBy = req.user._id;
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  let customer = new Customer(req.body);
  if (req.files && req.files.file) {
    customer.profileImage = customer._id.toString().concat('.').concat(req.files.file.name.split('.').pop());
  }
  let customerDesireVehiclesData = req.body.desireVehicles || [];
  let customerTradeInVehiclesData = req.body.tradeInVehicles || [];

  return getInventory(req.headers.rooftopid, customerDesireVehiclesData, 0)
    .then(inventoryObjectList => {
      if (inventoryObjectList.length > 0) {
        return saveCustomerVehicle(inventoryObjectList, 0, req.headers.rooftopid, constants.INTEREST_TYPES.DESIRE);
      } else {
        return Promise.resolve([]);
      }
    })
    .then(customerVehicleList => {
      if (customerTradeInVehiclesData.length > 0) {
        return saveCustomerVehicle(customerTradeInVehiclesData, 0, req.headers.rooftopid, constants.INTEREST_TYPES.TRADE_IN, customerVehicleList);
      } else {
        return Promise.resolve(customerVehicleList);
      }
    })
    .then(customerVehicleList => {
      customer.customerVehicles = customerVehicleList;
      return customer.save();
    })
    .then(customer => {
      return Customer.findById(customer._id).exec();
    })
    .then(customer => {
      if (req.files && req.files.file) {
        let filePath = `dealerUploads/${customer.rooftop.parentCompany.companyId}/${customer.rooftop.dealerId}/customers/`;
        return aws.uploadImage(req.files.file, filePath, customer.profileImage, customer);
      } else {
        return Promise.resolve(customer);
      }
    })
    .then(customer => {
      if (!customer) {
        return res.status(500).send({message: constants.ERRORS.INTERNAL_SERVER});
      }
      return res.status(201).json(customer);
    })
    .catch(() => {
      return res.status(500).send({message: constants.ERRORS.INTERNAL_SERVER});
    });
}

// Upserts the given Customer in the DB at the specified ID
export function upsert(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: constants.ERRORS.SELECT_ROOFTOP});
  }
  if (req.body._id) {
    delete req.body._id;
  }
  const rooftopId = req.headers.rooftopid;
  if (req.files && req.files.file) {
    req.body.profileImage = req.params.id.toString().concat('.').concat(req.files.file.name.split('.').pop());
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;
  let customerDesireVehiclesData = req.body.desireVehicles || [];
  let customerTradeInVehiclesData = req.body.tradeInVehicles || [];

  return getInventory(req.headers.rooftopid, customerDesireVehiclesData, 0)
    .then(inventoryObjectList => {
      if (inventoryObjectList.length > 0) {
        return saveCustomerVehicle(inventoryObjectList, 0, req.headers.rooftopid, constants.INTEREST_TYPES.DESIRE);
      } else {
        return Promise.resolve([]);
      }
    })
    .then(customerNewVehicleList => {
      if (customerTradeInVehiclesData.length > 0) {
        return saveCustomerVehicle(customerTradeInVehiclesData, 0, req.headers.rooftopid, constants.INTEREST_TYPES.TRADE_IN, customerNewVehicleList);
      } else {
        return Promise.resolve(customerNewVehicleList);
      }
    })
    .then(customerNewVehicleList => {
      if (customerNewVehicleList.length > 0) {
        return Customer.findById(req.params.id)
          .exec()
          .then(customersExistingVehicleList => {
            customersExistingVehicleList.customerVehicles.push(customerNewVehicleList);
            return customersExistingVehicleList.customerVehicles;
          });
      } else {
        return Promise.resolve(customerNewVehicleList);
      }
    })
    .then(customerVehicleList => {
      if (customerVehicleList.length > 0) {
        req.body.customerVehicles = customerVehicleList;
      }
      return Customer.findOneAndUpdate({_id: req.params.id, rooftop: rooftopId}, req.body, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }).exec();
    })
    .then(customer => {
      return Customer.findById(customer._id).exec();
    })
    .then(customer => {
      if (req.files && req.files.file) {
        let filePath = `dealerUploads/${customer.rooftop.parentCompany.companyId}/${customer.rooftop.dealerId}/customers/`;
        return aws.uploadImage(req.files.file, filePath, customer.profileImage, customer);
      } else {
        return Promise.resolve(customer);
      }
    })
    .then(customer => {
      if (!customer) {
        return res.status(500).send({message: constants.ERRORS.INTERNAL_SERVER});
      }
      return res.status(200).json(customer);
    })
    .catch(helper.handleError(res));
}

// Updates an existing Customer in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return Customer.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a Customer from the DB
export function destroy(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: constants.ERRORS.SELECT_ROOFTOP});
  }
  return Customer.findById(req.params.id).exec()
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
