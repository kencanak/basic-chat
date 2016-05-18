'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSocketId = updateSocketId;
exports.index = index;
exports.contactsListDetails = contactsListDetails;
exports.findUserByUserName = findUserByUserName;
exports.addContactsList = addContactsList;
exports.deleteContactsList = deleteContactsList;
exports.updateStatus = updateStatus;
exports.create = create;
exports.show = show;
exports.destroy = destroy;
exports.changePassword = changePassword;
exports.me = me;
exports.authCallback = authCallback;

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

/**
 * update socket Id for the particular user
 */
function updateSocketId(req, res) {
  var socketId = req.user.socketId;
  var id = req.user._id;

  return _user2.default.findById(id).exec().then(function (user) {
    user.socketId = socketId;
    return user.save().then(function () {
      res.status(204).end();
    }).catch(validationError(res));
  });
}

/**
 * Get list of users
 * restriction: 'admin'
 */
function index(req, res) {
  return _user2.default.find({}, '-salt -password').exec().then(function (users) {
    res.status(200).json(users);
  }).catch(handleError(res));
}

/**
 * Get list of users based on usernames
 */
function contactsListDetails(req, res) {
  var contacts = req.params.contacts.split(",");
  return _user2.default.find({ userName: { $in: contacts } }, '-salt -password -contacts').exec().then(function (contacts) {
    res.status(200).json({ data: contacts });
  }).catch(handleError(res));
}

/**
 * get list of users based on keywords search
 */

function findUserByUserName(req, res) {
  var keyword = new RegExp("^" + req.params.keyword, "gi");
  var page = (Number(req.params.page) - 1) * 5;
  var currentUser = req.user.userName;

  var queryContructor = {
    $or: [{
      userName: {
        $regex: keyword
      }
    }, {
      name: {
        $regex: keyword
      }
    }],
    userName: {
      $nin: currentUser
    }
  };

  return _user2.default.find(queryContructor, '-salt -password -contacts').exec().then(function (usersTotal) {
    return _user2.default.find(queryContructor, '-salt -password -contacts').skip(page).limit(5).sort({ userName: 1, name: 1 }).exec().then(function (users) {
      res.status(200).json({ data: users, total: usersTotal.length });
    }).catch(handleError(res));
  }).catch(handleError(res));
}

/**
 * add user contacts' list
 */
function addContactsList(req, res) {
  var contact = req.params.contact;
  var id = req.params.id;

  return _user2.default.findById(id).exec().then(function (user) {
    user.contacts.push(contact);
    return user.save().then(function () {
      res.status(204).end();
    }).catch(validationError(res));
  });
}

/**
 * delete user contacts' list
 */
function deleteContactsList(req, res) {
  var contact = req.params.contact;
  var id = req.params.id;

  return _user2.default.findById(id).exec().then(function (user) {
    var index = user.contacts.indexOf(contact);
    user.contacts.splice(index, 1);
    return user.save().then(function () {
      res.status(204).end();
    }).catch(validationError(res));
  });
}

/**
 * update status
 */
function updateStatus(req, res) {
  var status = req.params.status;
  var id = req.params.id;

  return _user2.default.findById(id).exec().then(function (user) {
    user.status = status;
    return user.save().then(function () {
      res.status(204).end();
    }).catch(validationError(res));
  });
}

/**
 * Creates a new user
 */
function create(req, res, next) {
  var newUser = new _user2.default(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save().then(function (user) {
    var token = _jsonwebtoken2.default.sign({ _id: user._id }, _environment2.default.secrets.session, {
      expiresIn: 60 * 60 * 5
    });
    res.json({ token: token });
  }).catch(validationError(res));
}

/**
 * Get a single user
 */
function show(req, res, next) {
  var userId = req.params.id;

  return _user2.default.findById(userId).exec().then(function (user) {
    if (!user) {
      return res.status(404).end();
    }
    res.json(user.profile);
  }).catch(function (err) {
    return next(err);
  });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
function destroy(req, res) {
  return _user2.default.findByIdAndRemove(req.params.id).exec().then(function () {
    res.status(204).end();
  }).catch(handleError(res));
}

/**
 * Change a users password
 */
function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return _user2.default.findById(userId).exec().then(function (user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      return user.save().then(function () {
        res.status(204).end();
      }).catch(validationError(res));
    } else {
      return res.status(403).end();
    }
  });
}

/**
 * Get my info
 */
function me(req, res, next) {
  var userId = req.user._id;

  return _user2.default.findOne({ _id: userId }, '-salt -password').exec().then(function (user) {
    // don't ever give out the password or salt
    if (!user) {
      return res.status(401).end();
    }
    res.json(user);
  }).catch(function (err) {
    return next(err);
  });
}

/**
 * Authentication callback
 */
function authCallback(req, res, next) {
  res.redirect('/');
}
//# sourceMappingURL=user.controller.js.map
