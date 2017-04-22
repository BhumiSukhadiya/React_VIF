'use strict';

import mongoose, {Schema} from 'mongoose';
let ObjectId = Schema.ObjectId;

var StatePrefixSchema = new mongoose.Schema({
  state: {type: String, trim: true, required: true},
  abbreviation: {type: String, uppercase: true, required: true},
  prefix: {type: Number, required: true},
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
});

/**
 * Validations
 */

// Validate state abbreviation length
StatePrefixSchema
  .path('abbreviation')
  .validate(function (abbreviation) {
    return abbreviation.length == 2;
  }, '`abbreviation` must be of 2 characters only.');

export default mongoose.model('StatePrefix', StatePrefixSchema);
