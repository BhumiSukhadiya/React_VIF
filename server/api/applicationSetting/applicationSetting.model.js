'use strict';

import mongoose, {Schema} from 'mongoose';
let ObjectId = Schema.ObjectId;

var ApplicationSettingSchema = new mongoose.Schema({
  applicationName: {type: String, trim: true, required: true},
  siteURL: {type: String, trim: true, required: true},
  contactEmail: {type: String, trim: true},
  contactPhone: {type: String, trim: true},
  decodeVehicleApiUrl: {type: String, trim: true},
  cdnServer: {
    accessKeyId: {type: String, trim: true},
    secretAccessKey: {type: String, trim: true},
    region: {type: String, trim: true},
    bucketName: {type: String, trim: true},
    serverUrl: {type: String, trim: true},
  },
  credit700: {
    baseUrl: {type: String, trim: true},
    account: {type: String, trim: true},
    password: {type: String, trim: true}
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
ApplicationSettingSchema
  .pre('findOne', populateReferences)
  .pre('findById', populateReferences)
  .pre('find', populateReferences);

function populateReferences() {
  return this.populate('createdBy', 'name')
    .populate('updatedBy', 'name');
}

export default mongoose.model('ApplicationSetting', ApplicationSettingSchema);
