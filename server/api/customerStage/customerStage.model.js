'use strict';

import constants from '../../config/constants';
import _ from 'lodash';
let ObjectId = Schema.ObjectId;
import mongoose, {Schema} from 'mongoose';

var CustomerStageSchema = new mongoose.Schema({
  stageName: {type: String, enum: _.toArray(constants.CUSTOMER_STAGES)},
  rooftop: {type: ObjectId, ref: 'Rooftop', required: true},
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
});

export default mongoose.model('CustomerStage', CustomerStageSchema);
