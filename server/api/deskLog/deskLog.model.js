'use strict';

import mongoose, {Schema} from 'mongoose';
import constants from '../../config/constants';
import _ from 'lodash';

let ObjectId = Schema.ObjectId;

let DeskLogSchema = new mongoose.Schema({
  type: {type: String, enum: _.toArray(constants.LOG_TYPES), required: true},
  time: {type: Date, default: Date.now},
  note: {type: String, trim: true},
  customer: {type: ObjectId, ref: 'Customer', required: true},
  rooftop: {type: ObjectId, ref: 'Rooftop', required: true},
  roadToSale: [{
    stepId: {type: ObjectId, ref: 'RoadToSale'},
    status: {type: String, enum: _.toArray(constants.ROAD_TO_SALE_STATUSES)}
  }],
  lastMeaningfulCall: {type: Date},
  lastMeaningfulEmail: {type: Date},
  lastMeaningfulCallBack: {type: Date},
  lastMeaningfulEmailBack: {type: Date},
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
});

DeskLogSchema
  .pre('findOne', populateReferences)
  .pre('findById', populateReferences)
  .pre('find', populateReferences);

function populateReferences() {
  return this.populate('customer', '-createdAt -createdBy -updatedAt -updatedBy')
    .populate('roadToSale', '-createdAt -createdBy -updatedAt -updatedBy')
    .populate('roadToSale.stepId', 'stepName')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name');
}

export default mongoose.model('DeskLog', DeskLogSchema);
