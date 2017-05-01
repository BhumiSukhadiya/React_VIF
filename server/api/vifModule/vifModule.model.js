'use strict';

import mongoose, {Schema} from 'mongoose';
let ObjectId = Schema.ObjectId;

var VifModuleSchema = new mongoose.Schema({
  name: {type: String, trim: true, required: true},
  appLabel: {type: String, trim: true, required: true},
  description: {type: String, trim: true},
  code: {type: String, trim: true, required: true},
  price : {
    cost: Number,
    retail: Number
  },
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
});

/**
 * Pre-find hook to populate reference objects.
 */
VifModuleSchema
  .pre('findOne', populateReferences)
  .pre('findById', populateReferences)
  .pre('find', populateReferences);

function populateReferences() {
  return this.populate('createdBy', 'name')
    .populate('updatedBy', 'name');
}

export default mongoose.model('VifModule', VifModuleSchema);
