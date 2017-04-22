'use strict';

import mongoose, {Schema} from 'mongoose';
import _ from 'lodash';
import constants from '../../config/constants';
let ObjectId = Schema.ObjectId;

var AdvertisingSourceSchema = new mongoose.Schema({
  name: {type: String, trim: true, required: true},
  sourceType: {type: String, enum: _.toArray(constants.AD_SOURCE_TYPES), required: true},
  subCategory: {type: String, trim: true},
  rooftop: {type: ObjectId, ref: 'Rooftop', required: true},
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
});

/**
 * Pre-find hook to populate reference objects.
 */
AdvertisingSourceSchema
  .pre('findOne', populateReferences)
  .pre('findById', populateReferences)
  .pre('find', populateReferences);

function populateReferences() {
  return this.populate('createdBy', 'name')
    .populate('updatedBy', 'name');
}

export default mongoose.model('AdvertisingSource', AdvertisingSourceSchema);
