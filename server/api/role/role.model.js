'use strict';

import mongoose, {Schema} from 'mongoose';
let ObjectId = Schema.ObjectId;

var RoleSchema = new mongoose.Schema({
  name: {type: String, trim: true, required: true},
  nameSlug: {type: String, trim: true, required: true},
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
});

export default mongoose.model('Role', RoleSchema);
