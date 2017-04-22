'use strict';

import mongoose, {Schema} from 'mongoose';
let ObjectId = Schema.ObjectId;

var RoadToSaleSchema = new mongoose.Schema({
  stepName: {type: String, trim: true, required: true},
  stepPosition: {type: Number},
  rooftop: {type: ObjectId, ref: 'Rooftop', required: true},
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
});

RoadToSaleSchema
  .pre('findOne', populateReferences)
  .pre('findById', populateReferences)
  .pre('find', populateReferences);

function populateReferences() {
  return this.populate('createdBy', 'name')
    .populate('updatedBy', 'name');
}

export default mongoose.model('RoadToSale', RoadToSaleSchema);
