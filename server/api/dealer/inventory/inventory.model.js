'use strict';

import constants from '../../../config/constants';
import _ from 'lodash';
let ObjectId = Schema.ObjectId;
import mongoose, {Schema} from 'mongoose';

var InventorySchema = new Schema({
  vin: {type: String, trim: true, uppercase: true, required: true},
  status: {type: String, enum: _.toArray(constants.STATUS_TYPES), required: true},
  statusDate: {type: Date, default: Date.now},
  stockNumber: {type: String, trim: true, uppercase: true, required: true},
  stockType: {type: String, enum: _.toArray(constants.STOCK_TYPES), required: true},
  year: {type: Number, required: true},
  make: {type: String, trim: true, required: true},
  model: {type: String, trim: true, required: true},
  trim: {type: String, trim: true, required: true},
  description: {type: String, trim: true},
  location: {type: String, trim: true},
  imagePath: {type: String, trim: true},
  displayImage: {type: String, trim: true},
  drive: {type: String, trim: true},
  transmission: {type: String, trim: true},
  miles: {type: Number},
  vehicleType: {type: String, enum: _.toArray(constants.VEHICLE_TYPES)},
  costAmount: {type: Number},
  retailAmount: {type: Number},
  exteriorColor: {type: String, trim: true},
  payoffAmount: {type: Number},
  payoffDate: {type: Date},
  valuation: {type: Number},
  lienHolder: {type: String, trim: true},
  lienAddress: {
    addressLine1: {type: String, trim: true},
    addressLine2: {type: String, trim: true},
    city: {type: String, trim: true},
    state: {type: String, trim: true},
    zip: {type: String, trim: true}
  },
  roNumber: {type: Number},
  roAmount: {type: Number},
  opCode: {type: String, trim: true},
  opCodeDescription: {type: String, trim: true},
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
}, {
  'toObject': {
    virtuals: true
  }, 'toJSON': {
    virtuals: true
  }
});

/**
 * Virtuals
 */
// Display image url
InventorySchema
  .virtual('displayImageUrl')
  .get(function () {
    if (this.imagePath && this.displayImage) {
      return global.applicationSettings && global.applicationSettings.cdnServer && (`${global.applicationSettings.cdnServer.serverUrl}/${this.imagePath}/${this.displayImage}?ts=${Date.now()}`).replace(/\/\/+/g, '/');
    }
    return global.applicationSettings && global.applicationSettings.cdnServer && `${global.applicationSettings.cdnServer.serverUrl}/images/defaultVehicle.png`;
  });

// Display thumbnail image url
InventorySchema
  .virtual('displayThumbnailImageUrl')
  .get(function () {
    if (this.imagePath && this.displayImage) {
      return global.applicationSettings && global.applicationSettings.cdnServer && (`${global.applicationSettings.cdnServer.serverUrl}/${this.imagePath}/thumbnail/${this.displayImage}?ts=${Date.now()}`).replace(/\/\/+/g, '/');
    }
    return global.applicationSettings && global.applicationSettings.cdnServer && `${global.applicationSettings.cdnServer.serverUrl}/images/thumbnail/defaultVehicle.png`;
  });

/**
 * Validations
 */

// Validate empty email
InventorySchema
  .path('vin')
  .validate(function (vin) {
    return vin.length === 17;
  }, 'VIN must be of 17 characters');

export default function initializeConnection(connection) {
  return connection.model('Inventory', InventorySchema);
}
