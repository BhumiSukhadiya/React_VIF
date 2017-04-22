/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/inventories              ->  index
 * POST    /api/inventories              ->  create
 * GET     /api/inventories/:id          ->  show
 * PUT     /api/inventories/:id          ->  upsert
 * PATCH   /api/inventories/:id          ->  patch
 * DELETE  /api/inventories/:id          ->  destroy
 */

'use strict';

import constants from '../../../config/constants';
import InventorySchema from "./inventory.model";
import * as aws from '../../../components/aws';
import * as helper from '../../../components/helper';

// Gets a list of Inventories
export function index(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: constants.ERRORS.SELECT_ROOFTOP});
  }

  return helper.getDealerConnection(req.headers.rooftopid)
    .then(rooftopConnection => {
      if (!rooftopConnection) {
        return Promise.reject({message: constants.ERRORS.SELECT_VALID_ROOFTOP});
      }

      let total = 0;
      let Inventory = new InventorySchema(rooftopConnection.connection);
      let pagingParams = helper.getLazyLoadQueryConditions(req.query, Inventory.schema, 'vin');
      return Inventory.count(pagingParams.condition)
        .exec()
        .then(count => {
          total = count;
          return Inventory.find(pagingParams.condition)
            .skip(pagingParams.skip)
            .limit(pagingParams.limit)
            .sort(pagingParams.sort)
            .exec();
        })
        .then(inventories => {
          return res.status(200).json({inventories: inventories, total: total});
        })
        .catch(helper.handleError(res));
    })
    .catch(helper.handleError(res));
}

// Gets a single Inventory from the DB
export function show(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: constants.ERRORS.SELECT_ROOFTOP});
  }

  return helper.getDealerConnection(req.headers.rooftopid)
    .then(rooftopConnection => {
      if (!rooftopConnection) {
        return Promise.reject({message: constants.ERRORS.SELECT_VALID_ROOFTOP});
      }

      let Inventory = new InventorySchema(rooftopConnection.connection);
      if (req.params.id.length === 24) {
        return Inventory.findById(req.params.id).exec();
      }

      return Inventory.findOne({$or: [{vin: req.params.id.toUpperCase()}, {stockNumber: req.params.id.toUpperCase()}]}).exec();
    })
    .then(helper.handleEntityNotFound(res))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Creates a new Inventory in the DB
export function create(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: constants.ERRORS.SELECT_ROOFTOP});
  }

  return helper.getDealerConnection(req.headers.rooftopid)
    .then(rooftopConnection => {
      if (!rooftopConnection) {
        return Promise.reject({message: constants.ERRORS.SELECT_VALID_ROOFTOP});
      }
      req.body.createdAt = Date.now();
      req.body.createdBy = req.user._id;
      req.body.updatedAt = Date.now();
      req.body.updatedBy = req.user._id;

      let Inventory = new InventorySchema(rooftopConnection.connection);
      let newInventory = new Inventory(req.body);
      if (req.files && req.files.file) {
        newInventory.imagePath = `dealerUploads/${rooftopConnection.rooftop.parentCompany.companyId}/${rooftopConnection.rooftop.dealerId}/inventories/${newInventory.vin || newInventory._id.toString()}/`;
        newInventory.displayImage = (newInventory.vin || newInventory._id.toString()).concat('.').concat(req.files.file.name.split('.').pop());
      }

      return newInventory.save()
        .then(inventory => {
          return Inventory.findById(inventory._id).exec();
        })
        .then(inventory => {
          if (req.files && req.files.file) {
            return aws.uploadImage(req.files.file, inventory.imagePath, inventory.displayImage, inventory);
          } else {
            return Promise.resolve(inventory);
          }
        })
        .then(inventory => {
          if (!inventory) {
            return res.status(500).send({message: constants.ERRORS.INTERNAL_SERVER});
          }
          return res.status(201).json(inventory);
        })
        .catch((error) => {
          return res.status(500).send({message: constants.ERRORS.INTERNAL_SERVER});
        });
    })
    .catch(helper.handleError(res));
}

// Upserts the given Inventory in the DB at the specified ID
export function upsert(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: constants.ERRORS.SELECT_ROOFTOP});
  }

  return helper.getDealerConnection(req.headers.rooftopid)
    .then(rooftopConnection => {
      if (!rooftopConnection) {
        return Promise.reject({message: constants.ERRORS.SELECT_VALID_ROOFTOP});
      }

      if (req.body._id) {
        delete req.body._id;
      }
      if (req.files && req.files.file) {
        req.body.imagePath = `dealerUploads/${rooftopConnection.rooftop.parentCompany.companyId}/${rooftopConnection.rooftop.dealerId}/inventories/${req.body.vin || req.params.id.toString()}/`;
        req.body.displayImage = (req.body.vin || req.params.id.toString()).concat('.').concat(req.files.file.name.split('.').pop());
      }
      req.body.updatedAt = Date.now();
      req.body.updatedBy = req.user._id;

      let Inventory = new InventorySchema(rooftopConnection.connection);
      return Inventory.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }).exec()
        .then(inventory => {
          return Inventory.findById(inventory._id).exec();
        })
        .then(inventory => {
          if (req.files && req.files.file) {
            return aws.uploadImage(req.files.file, inventory.imagePath, inventory.displayImage, inventory);
          } else {
            return Promise.resolve(inventory);
          }
        })
        .then(inventory => {
          if (!inventory) {
            return res.status(500).send({message: constants.ERRORS.INTERNAL_SERVER});
          }
          return res.status(200).json(inventory);
        })
        .catch(helper.handleError(res));
    })
    .catch(helper.handleError(res));
}

// Updates an existing Inventory in the DB
export function patch(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: constants.ERRORS.SELECT_ROOFTOP});
  }

  return helper.getDealerConnection(req.headers.rooftopid)
    .then(rooftopConnection => {
      if (!rooftopConnection) {
        return Promise.reject({message: constants.ERRORS.SELECT_VALID_ROOFTOP});
      }
      if (req.body._id) {
        delete req.body._id;
      }
      req.body.updatedAt = Date.now();
      req.body.updatedBy = req.user._id;

      let Inventory = new InventorySchema(rooftopConnection.connection);
      return Inventory.findById(req.params.id).exec();
    })
    .then(helper.handleEntityNotFound(res))
    .then(helper.patchUpdates(req.body))
    .then(helper.respondWithResult(res))
    .catch(helper.handleError(res));
}

// Deletes a Inventory from the DB
export function destroy(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: constants.ERRORS.SELECT_ROOFTOP});
  }

  return helper.getDealerConnection(req.headers.rooftopid)
    .then(rooftopConnection => {
      if (!rooftopConnection) {
        return Promise.reject({message: constants.ERRORS.SELECT_VALID_ROOFTOP});
      }

      let Inventory = new InventorySchema(rooftopConnection.connection);
      return Inventory.findById(req.params.id).exec();
    })
    .then(helper.handleEntityNotFound(res))
    .then(helper.removeEntity(res))
    .catch(helper.handleError(res));
}
