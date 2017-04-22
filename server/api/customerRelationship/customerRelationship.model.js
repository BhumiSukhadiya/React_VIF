'use strict';

import mongoose, {Schema} from 'mongoose';
import constants from '../../config/constants';
import _ from 'lodash';
let ObjectId = Schema.ObjectId;

var CustomerRelationshipSchema = new mongoose.Schema({
  relatedCustomer: {type: ObjectId, ref: 'Customer'},
  relateType: {type: String, enum: _.toArray(constants.CUSTOMER_RELATIONSHIPS)},
  rooftop: {type: ObjectId, ref: 'Rooftop', required: true},
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
});

CustomerRelationshipSchema
  .pre('findOne', populateReferences)
  .pre('findById', populateReferences)
  .pre('find', populateReferences);

function populateReferences() {
  return this.populate('relatedCustomer', 'name');
}

export default mongoose.model('CustomerRelationship', CustomerRelationshipSchema);
