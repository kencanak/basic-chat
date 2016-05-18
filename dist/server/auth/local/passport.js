'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function localAuthenticate(User, userName, password, done) {

  User.findOne({
    userName: userName.toLowerCase()
  }).exec().then(function (user) {
    if (!user) {
      return done(null, false, {
        message: 'This user name is not registered.'
      });
    }
    user.authenticate(password, function (authError, authenticated) {
      if (authError) {
        return done(authError);
      }
      if (!authenticated) {
        return done(null, false, { message: 'This password is not correct.' });
      } else {
        return done(null, user);
      }
    });
  }).catch(function (err) {
    return done(err);
  });
}

function setup(User, config) {
  _passport2.default.use(new _passportLocal.Strategy({
    usernameField: 'userName',
    passwordField: 'password' // this is the virtual field on the model
  }, function (userName, password, done) {

    return localAuthenticate(User, userName, password, done);
  }));
}
//# sourceMappingURL=passport.js.map
