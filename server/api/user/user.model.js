'use strict';
/*eslint no-invalid-this:0*/
import crypto from 'crypto';
import mongoose, {Schema} from 'mongoose';
import _ from 'lodash';
import constants from '../../config/constants';

let ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  name: {
    first: {type: String, trim: true, required: true},
    middle: {type: String, trim: true},
    last: {type: String, trim: true}
  },
  nickname: {type: String, trim: true},
  profilePhoto: {type: String, trim: true},
  address: {
    addressLine1: {type: String, trim: true},
    addressLine2: {type: String, trim: true},
    city: {type: String, trim: true},
    state: {type: String, trim: true},
    zip: {type: String, trim: true},
    country: {type: String, trim: true}
  },
  phones: [{
    number: String,
    numberType: {type: String, enum: _.toArray(constants.PHONE_NUMBER_TYPES)}
  }],
  voipNumber: {type: String, trim: true},
  department: _.toArray(constants.DEPARTMENTS),
  email: {type: String, trim: true, lowercase: true, required: true},
  username: {type: String, trim: true, lowercase: true, required: true},
  password: {type: String, required: true},
  salt: String,
  resetPassword: Boolean,
  dmsId: {type: String, trim: true},
  emergencyContact: {
    firstName: {type: String, trim: true},
    middleName: {type: String, trim: true},
    lastName: {type: String, trim: true},
    phone: Number,
    email: {type: String, trim: true, lowercase: true},
    relationship: {type: String, enum: _.toArray(constants.USER_RELATIONSHIPS)}
  },
  permissions: [{type: String, enum: _.toArray(constants.USER_PERMISSIONS)}],
  positions: [{type: ObjectId, ref: 'Position'}],
  roles: [{type: ObjectId, ref: 'Role'}],
  modules: [{type: ObjectId, ref: 'VifModule'}],
  rooftops: [{type: ObjectId, ref: 'Rooftop'}],
  mobileSetting: {
    backgroundImage: {type: String, trim: true},
    dashboardOrder: [{
      module: {type: ObjectId, ref: 'VifModule'},
      position: {type: Number}
    }]
  },
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
UserSchema
  .virtual('displayName')
  .get(function () {
    return (`${this.name.first || ''} ${this.name.middle || ''} ${this.name.last || ''}`).replace(/\s\s+/g, ' ');
  });

// Profile photo url
UserSchema
  .virtual('profilePhotoUrl')
  .get(function () {
    if (this.profilePhoto) {
      return global.applicationSettings && global.applicationSettings.cdnServer && (`${global.applicationSettings.cdnServer.serverUrl}/dealerUploads/users/${this.profilePhoto}?ts=${Date.now()}`).replace(/\/\/+/g, '/');
    }
    return global.applicationSettings && global.applicationSettings.cdnServer && `${global.applicationSettings.cdnServer.serverUrl}/images/defaultUser.png`;
  });

// Mobile background image
UserSchema
  .virtual('backgroundImageUrl')
  .get(function () {
    if (this.mobileSetting.backgroundImage) {
      return global.applicationSettings && global.applicationSettings.cdnServer && (`${global.applicationSettings.cdnServer.serverUrl}/dealerUploads/users/backgroundImages/${this.mobileSetting.backgroundImage}`).replace(/\/\/+/g, '/');
    }
    return global.applicationSettings && global.applicationSettings.cdnServer && `${global.applicationSettings.cdnServer.serverUrl}/images/defaultBackgroundImage.png`;
  });

// Profile thumbnail photo url
UserSchema
  .virtual('profileThumbnailPhotoUrl')
  .get(function () {
    if (this.profilePhoto) {
      return global.applicationSettings && global.applicationSettings.cdnServer && (`${global.applicationSettings.cdnServer.serverUrl}/dealerUploads/users/thumbnail/${this.profilePhoto}?ts=${Date.now()}`).replace(/\/\/+/g, '/');
    }
    return global.applicationSettings && global.applicationSettings.cdnServer && `${global.applicationSettings.cdnServer.serverUrl}/images/thumbnail/defaultUser.png`;
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function (email) {
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(function (password) {
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function (value, respond) {
    return this.constructor.findOne({email: value}).exec()
      .then(user => {
        if (user) {
          if (this.id === user.id) {
            return respond(true);
          }
          return respond(false);
        }
        return respond(true);
      })
      .catch(function (err) {
        throw err;
      });
  }, 'The specified email address is already in use.');

var validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-find hook to populate reference objects.
 */
UserSchema
  .pre('findOne', populateReferences)
  .pre('findById', populateReferences)
  .pre('find', populateReferences);

function populateReferences() {
  return this.populate('positions', 'name nameSlug')
    .populate('roles', 'name nameSlug')
    .populate('modules', 'name code appLabel')
    .populate('rooftops', 'parentCompany dealerId')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name');
}

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
    // Handle new/update passwords
    if (!this.isModified('password')) {
      return next();
    }

    if (!validatePresenceOf(this.password)) {
      return next(new Error('Invalid password'));
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if (saltErr) {
        return next(saltErr);
      }
      this.salt = salt;
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if (encryptErr) {
          return next(encryptErr);
        }
        this.password = hashedPassword;
        return next();
      });
    });
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    let defaultByteSize = 16;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    } else {
      throw new Error('Missing Callback');
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, salt.toString('base64'));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return null;
      } else {
        return callback('Missing password or salt');
      }
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha1')
        .toString('base64');
    }

    crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha1', (err, key) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, key.toString('base64'));
      }
    });
  }
};

export default mongoose.model('User', UserSchema);
