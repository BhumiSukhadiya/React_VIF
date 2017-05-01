'use strict';

import User from './user.model';
import * as aws from '../../components/aws';
import _ from 'lodash';
import * as helper from '../../components/helper';

/**
 * Get list of users
 */
export function index(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  req.query.rooftopid = req.headers.rooftopid;

  let pagingParams = helper.getLazyLoadQueryConditions(req.query, User.schema, 'name');
  return User.count(pagingParams.condition)
    .exec()
    .then(count => {
      return User.find(pagingParams.condition, '-salt -password')
        .skip(pagingParams.skip)
        .limit(pagingParams.limit)
        .sort(pagingParams.sort)
        .exec()
        .then(users => res.status(200).json({users: users, total: count}));
    })
    .catch(helper.handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  if (!req.body.roles) {
    return res.status(406).send({message: 'Please specify user roles.'});
  }
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  req.body.rooftops = req.headers.rooftopid;

  let newUser = new User(req.body);
  newUser.createdAt = Date.now();
  newUser.createdBy = req.user._id;
  newUser.updatedAt = Date.now();
  newUser.updatedBy = req.user._id;

  if(req.files && req.files.file) {
    newUser.profilePhoto = newUser._id.toString().concat('.').concat(req.files.file.name.split('.').pop());
  }

  return newUser.save()
    .then(user => {
      if (req.files && req.files.file) {
        let filePath = `dealerUploads/users/`;
        return aws.uploadImage(req.files.file, filePath, user.profilePhoto, user);
      } else {
        return Promise.resolve(user);
      }
    })
    .then(user => {
      return User.findById(user._id, '-salt -password').exec();
    })
    .then(user => {
      if (!user) {
        return res.status(500).end({message: 'The server encountered an internal error and was unable to complete your request. Please contact administrator.'});
      }
      return res.status(200).json(user);
    })
    .catch(helper.validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  return User.findById(req.params.id, '-salt -password').exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      return res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function () {
      return res.status(204).end();
    })
    .catch(helper.handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  let userId = req.user._id;
  let oldPass = String(req.body.oldPassword);
  let newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            return res.status(204).end();
          })
          .catch(helper.validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Upserts the given user in the DB at the specified ID
 */
export function upsert(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }

  if(req.body._id) {
    delete req.body._id;
  }
  if(req.body.email) {
    delete req.body.email;
  }
  if(req.body.username) {
    delete req.body.username;
  }
  if(req.body.password) {
    delete req.body.password;
  }

  if(req.files && req.files.file) {
    req.body.profilePhoto = req.params.id.concat('.').concat(req.files.file.name.split('.').pop());
  }
  req.body.updatedAt = Date.now();
  req.body.updatedBy = req.user._id;

  return User.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()
    .then(user => {
      if (req.files && req.files.file) {
        let filePath = `dealerUploads/users/`;
        return aws.uploadImage(req.files.file, filePath, user.profilePhoto, user);
      } else {
        return Promise.resolve(user);
      }
    })
    .then(user => {
      return User.findById(user._id, '-salt -password').exec();
    })
    .then(user => {
      if (!user) {
        return res.status(500).end({message: 'The server encountered an internal error and was unable to complete your request. Please contact administrator.'});
      }
      return res.status(200).json(user);
    })
    .catch(helper.handleError(res));
}

/**
 * Get my info
 */
export function me(req, res, next) {
  return User.findById(req.user._id, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      return res.json(user);
    })
    .catch(err => next(err));
}

export function changeModuleOrder(req, res) {
  const module = req.body.module;
  return User.findById(req.user._id)
    .exec()
    .then(user => {
      _.forEach(module, function (value, index) {
        module[index].position = index + 1;
      });
      user.mobileSetting.dashboardOrder = module;
      return user.save();
    })
    .then(user => {
      return User.findById(user._id, 'mobileSetting.dashboardOrder').exec();
    })
    .then(user => {
      if (!user) {
        return res.status(401).end();
      }
      return res.json(user);
    })
    .catch(err => next(err));
}

export function changeBackgroundImage(req, res) {
  if (!req.headers.rooftopid) {
    return res.status(406).send({message: 'Please select rooftop.'});
  }
  if (!(req.files && req.files.file)) {
    return res.status(406).send({message: 'Please upload background image file.'});
  }
  return User.findById(req.user._id)
    .exec()
    .then((user) => {
      user.mobileSetting.backgroundImage = user._id.toString().concat('.').concat(req.files.file.name.split('.').pop());
      return user.save();
    })
    .then((user) => {
      if (user.mobileSetting.backgroundImage) {
        let filePath = `dealerUploads/users/backgroundImages/`;
        return aws.uploadImage(req.files.file, filePath, user.mobileSetting.backgroundImage, user);
      } else {
        return Promise.resolve(user);
      }
    }).then(user => {
      return User.findById(user._id, '-salt -password').exec();
    })
    .then(user => {
      if (!user) {
        return res.status(500).end({message: 'The server encountered an internal error and was unable to complete your request. Please contact administrator.'});
      }
      return res.status(200).json(user);
    })
    .catch(helper.handleError(res));
}
