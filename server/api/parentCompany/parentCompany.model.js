'use strict';

import mongoose, {Schema} from 'mongoose';
let ObjectId = Schema.ObjectId;

var ParentCompanySchema = new mongoose.Schema({
  companyId: {type: String, trim: true, unique: true, required: true},
  name: {type: String, trim: true, required: true},
  address: {
    addressLine1: {type: String, trim: true},
    addressLine2: {type: String, trim: true},
    city: {type: String, trim: true},
    state: {type: String, trim: true, required: true},
    zip: {type: String, trim: true},
    country: {type: String, trim: true}
  },
  owner: {
    name: {type: String, trim: true},
    phone: Number
  },
  contactPerson: {
    name: {type: String, trim: true},
    phone: Number
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
ParentCompanySchema
  .pre('findOne', populateReferences)
  .pre('findById', populateReferences)
  .pre('find', populateReferences);

function populateReferences() {
  return this.populate('createdBy', 'name')
    .populate('updatedBy', 'name');
}

export default mongoose.model('ParentCompany', ParentCompanySchema);
