import {ERRORS as errorMessages} from '../../config/constants';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

function localAuthenticate(User, email, password, done) {
  User.findOne({
    $or: [
      {email: email.toLowerCase()},
      {username: email.toLowerCase()}
    ]
  }).exec()
    .then(user => {
      if (!user) {
        return done({message: errorMessages.USER_NOT_REGISTERED});
      }
      if (!user.active) {
        return done({message: errorMessages.USER_INACTIVE});
      }

      user.authenticate(password, function (authError, authenticated) {
        if (authError) {
          return done(authError);
        }
        if (!authenticated) {
          return done({message: errorMessages.INVALID_CREDENTIALS});
        } else {
          return done(null, user);
        }
      });
    })
    .catch(err => done(err));
}

export function setup(User) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, function (email, password, done) {
    return localAuthenticate(User, email, password, done);
  }));
}
