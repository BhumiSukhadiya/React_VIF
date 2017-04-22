'use strict';

import mongoose, {Schema} from 'mongoose';
let ObjectId = Schema.ObjectId;

var PositionSchema = new mongoose.Schema({
  name: {type: String, trim: true, required: true},
  nameSlug: {type: String, trim: true, required: true},
  role: {type: ObjectId, ref: 'Role'},
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
});

export default mongoose.model('Position', PositionSchema);
