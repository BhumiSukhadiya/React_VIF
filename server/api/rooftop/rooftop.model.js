'use strict';

import mongoose, {Schema} from 'mongoose';
import _ from 'lodash';
import constants from '../../config/constants';
let ObjectId = Schema.ObjectId;

var RooftopSchema = new mongoose.Schema({
  dealerId: {type: String, trim: true, unique: true, required: true},
  name: {type: String, trim: true, required: true},
  doingBusinessAs: {type: String, trim: true},
  address: {
    addressLine1: {type: String, trim: true},
    addressLine2: {type: String, trim: true},
    city: {type: String, trim: true},
    state: {type: String, trim: true, required: true},
    zip: {type: String, trim: true},
    country: {type: String, trim: true}
  },
  mainPhone: {type: Number, required: true},
  crmProvider: {
    name: {type: String, trim: true},
    routeAddress: {type: String, trim: true},
    fileType: {type: String, enum: _.toArray(constants.CRM_PROVIDER_FILE_TYPES)}
  },
  logoImage: {type: String, trim: true},
  connectionString: {type: String, trim: true, required: true},
  searchFields: [{type: String, enum: _.toArray(constants.SEARCH_FIELDS)}],
  parentCompany: {type: ObjectId, ref: 'ParentCompany', required: true},
  modules: [{type: ObjectId, ref: 'VifModule'}],
  scrollingText: {type: String, trim: true},
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

// Logo image url
RooftopSchema
  .virtual('logoImageUrl')
  .get(function () {
    if (this.logoImage) {
      return global.applicationSettings && global.applicationSettings.cdnServer && (`${global.applicationSettings.cdnServer.serverUrl}/dealerUploads/${this.parentCompany.companyId}/${this.dealerId}/${this.logoImage}?ts=${Date.now()}`).replace(/\/\/+/g, '/');
    }

    return global.applicationSettings && global.applicationSettings.cdnServer && `${global.applicationSettings.cdnServer.serverUrl}/images/defaultUser.png`;
  });

// Logo thumbnail image url
RooftopSchema
  .virtual('logoThumbnailImageUrl')
  .get(function () {
    if (this.logoImage) {
      return global.applicationSettings && global.applicationSettings.cdnServer && (`${global.applicationSettings.cdnServer.serverUrl}/dealerUploads/${this.parentCompany.companyId}/${this.dealerId}/thumbnail/${this.logoImage}?ts=${Date.now()}`).replace(/\/\/+/g, '/');
    }

    return global.applicationSettings && global.applicationSettings.cdnServer && `${global.applicationSettings.cdnServer.serverUrl}/images/thumbnail/defaultLogo.png`;
  });

/**
 * Pre-find hook to populate reference objects.
 */
RooftopSchema
  .pre('findOne', populateReferences)
  .pre('findById', populateReferences)
  .pre('find', populateReferences);

function populateReferences() {
  return this.populate('parentCompany', 'name companyId')
    .populate('modules', 'name code appLabel')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name');
}

export default mongoose.model('Rooftop', RooftopSchema);
