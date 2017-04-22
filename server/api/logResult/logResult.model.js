'use strict';

import mongoose, {Schema} from 'mongoose';
import constants from '../../config/constants';
import _ from 'lodash';
let ObjectId = Schema.ObjectId;

var LogResultSchema = new mongoose.Schema({
  resultName: {type: String, trim: true, required: true},
  resultImage: {type: String, trim: true},
  toolTipText: {type: String, trim: true},
  resultType: {type: String, enum: _.toArray(constants.CUSTOMER_RESULTS)},
  rooftop: {type: ObjectId, ref: 'Rooftop', required: true},
  active: {type: Boolean, default: true},
  createdBy: {type: ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedBy: {type: ObjectId, ref: 'User'},
  updatedAt: {type: Date, default: Date.now}
}, {
  'toObject': {
    virtuals: true
  }, 'toJSON': {
    virtuals: true
  }
});

/**
 * Virtuals
 */

// log result image url
LogResultSchema
  .virtual('resultImageUrl')
  .get(function () {
    return (global.applicationSettings && global.applicationSettings.cdnServer && `${global.applicationSettings.cdnServer.serverUrl}/dealerUploads/${this.rooftop.parentCompany.companyId}/${this.rooftop.dealerId}/results/${this.resultImage || 'default.png'}?ts=${Date.now()}`).replace(/\/\/+/g, '/');
  });


LogResultSchema
  .pre('findOne', populateReferences)
  .pre('findById', populateReferences)
  .pre('find', populateReferences);

function populateReferences() {
  return this.populate('rooftop', 'parentCompany dealerId')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name');
}

export default mongoose.model('LogResult', LogResultSchema);
