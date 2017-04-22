'use strict';

import constants from '../../config/constants';
import _ from 'lodash';
let ObjectId = Schema.ObjectId;
import mongoose, {Schema} from 'mongoose';

var CustomerVehicleSchema = new mongoose.Schema({
  vin: {type: String, trim: true, required: true},
  year: {type: Number, required: true},
  make: {type: String, trim: true, required: true},
  model: {type: String, trim: true, required: true},
  stockNo: {type: String, trim: true, required: true},
  color: {type: String, trim: true},
  miles: {type: String, trim: true},
  status: {type: String, trim: true},
  vehicleType: {type: String, trim: true},
  stockType: {type: String, trim: true, required: true},
  interestType: {type: String, enum: _.toArray(constants.INTEREST_TYPES), required: true},
  statusDate: {type: Date},
  salePrice: {type: Number},
  salePayment: {type: Number},
  saleTerm: {type: Number},
  saleAPR: {type: Number},
  saleType: {type: String, enum: _.toArray(constants.SALE_TYPES)},
  saleResidualAmount: {type: Number},
  saleCost: {type: Number},
  statusBy: {type: ObjectId, ref: 'User'},
  rooftop: {type: ObjectId, ref: 'Rooftop', required: true},
  payoffAmount: {type: Number},
  roAmount: {type: Number},
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
});

export default mongoose.model('CustomerVehicle', CustomerVehicleSchema);
