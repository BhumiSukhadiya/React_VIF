'use strict';

import constants from '../../config/constants';
import _ from 'lodash';
let ObjectId = Schema.ObjectId;
import mongoose, {Schema} from 'mongoose';

var CustomerResultSchema = new mongoose.Schema({
  resultName: {type: String, enum: _.toArray(constants.CUSTOMER_RESULTS)},
  stages: [{type: ObjectId, ref: 'CustomerStage'}],
  rooftop: {type: ObjectId, ref: 'Rooftop', required: true},
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
});

CustomerResultSchema
  .pre('findOne', populateReferences)
  .pre('findById', populateReferences)
  .pre('find', populateReferences);

function populateReferences() {
  return this.populate('stages', 'stageName');
}

export default mongoose.model('CustomerResult', CustomerResultSchema);
