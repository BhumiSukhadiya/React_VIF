'use strict';

import mongoose, {Schema} from 'mongoose';
import constants from '../../config/constants';
import _ from 'lodash';
let ObjectId = Schema.ObjectId;

var CustomerSchema = Schema({
  salutation: {type: String, trim: true},
  name: {
    first: {type: String, trim: true, required: true},
    middle: {type: String, trim: true},
    last: {type: String, trim: true, required: true}
  },
  address: {
    addressLine1: {type: String, trim: true},
    addressLine2: {type: String, trim: true},
    city: {type: String, trim: true},
    state: {type: String, trim: true, required: true},
    zip: {type: String, trim: true},
    country: {type: String, trim: true}
  },
  email: [{type: String, trim: true}],
  phones: [{
    number: String,
    numberType: {type: String, enum: _.toArray(constants.PHONE_NUMBER_TYPES)}
  }],
  birthDate: {type: Date},
  ip: {type: String, trim: true},
  doNotMail: {type: Boolean, default: false},
  doNotEmail: {type: Boolean, default: false},
  doNotCall: {type: Boolean, default: false},
  doNotText: {type: Boolean, default: false},
  doNotMarket: {type: Boolean, default: false},
  profileImage: {type: String, trim: true},
  rooftop: {type: ObjectId, ref: 'Rooftop', required: true},
  customerVehicles: [{type: ObjectId, ref: 'CustomerVehicle'}],
  customerRelationships: [{
    relatedCustomer: {type: ObjectId, ref: 'Customer'},
    relationType: {type: String, enum: _.toArray(constants.CUSTOMER_RELATIONSHIPS)}
  }],
  advertisingSource: {type: ObjectId, ref: 'AdvertisingSource'},
  salesperson: [{type: ObjectId, ref: 'User'}],
  saleManager: [{type: ObjectId, ref: 'User'}],
  facebookId: {type: String, trim: true},
  twitterId: {type: String, trim: true},
  instagramId: {type: String, trim: true},
  notes: {type: String, trim: true},
  dmsId: {type: String, trim: true},
  stage: {type: ObjectId, ref: 'CustomerStage'},
  result: {type: ObjectId, ref: 'CustomerResult'},
  lastActivity: {type: Date},
  activityType: {type: String, enum: _.toArray(constants.ACTIVITY_TYPES)},
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
// Display name
CustomerSchema
  .virtual('displayName')
  .get(function () {
    return (`${this.name.first || ''} ${this.name.middle || ''} ${this.name.last || ''}`).replace(/\s\s+/g, ' ');
  });

// Profile image url
CustomerSchema
  .virtual('profileImageUrl')
  .get(function () {
    if(this.profilePhoto) {
      return global.applicationSettings && global.applicationSettings.cdnServer && (`${global.applicationSettings.cdnServer.serverUrl}/dealerUploads/${this.rooftop.parentCompany.companyId}/${this.rooftop.dealerId}/customers/${this.profileImage}?ts=${Date.now()}`).replace(/\/\/+/g, '/');
    }
    return global.applicationSettings && global.applicationSettings.cdnServer && `${global.applicationSettings.cdnServer.serverUrl}/images/defaultCustomer.png`;
  });

// Profile thumbnail image url
CustomerSchema
  .virtual('profileThumbnailImageUrl')
  .get(function () {
    if(this.profilePhoto) {
      return global.applicationSettings && global.applicationSettings.cdnServer && (`${global.applicationSettings.cdnServer.serverUrl}/dealerUploads/${this.rooftop.parentCompany.companyId}/${this.rooftop.dealerId}/customers/thumbnail/${this.profileImage}?ts=${Date.now()}`).replace(/\/\/+/g, '/');
    }
    return global.applicationSettings && global.applicationSettings.cdnServer && `${global.applicationSettings.cdnServer.serverUrl}/images/thumbnail/defaultCustomer.png`;
  });

// desire vehicle
CustomerSchema
  .virtual('desireVehicles')
  .get(function () {
    if(this.customerVehicles && this.customerVehicles.length > 0) {
      return _.filter(this.customerVehicles, {interestType: constants.INTEREST_TYPES.DESIRE});
    }
    return [];
  });

// desire vehicle
CustomerSchema
  .virtual('tradeInVehicles')
  .get(function () {
    if(this.customerVehicles && this.customerVehicles.length > 0) {
      return _.filter(this.customerVehicles, {interestType: constants.INTEREST_TYPES.TRADE_IN});
    }
    return [];
  });

CustomerSchema
  .pre('findOne', populateReferences)
  .pre('findById', populateReferences)
  .pre('find', populateReferences);

function populateReferences() {
  return this.populate('rooftop', 'parentCompany dealerId')
    .populate('customerVehicles', '-createdAt -createdBy -updatedAt -updatedBy')
    .populate('advertisingSource', 'name sourceType')
    .populate('stage', '-createdAt -createdBy -updatedAt -updatedBy')
    .populate('result', '-createdAt -createdBy -updatedAt -updatedBy')
    .populate('customerRelationships.relatedCustomer', 'name')
    .populate('salesperson', 'name')
    .populate('saleManager', 'name')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name');
}

export default mongoose.model('Customer', CustomerSchema);
