'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrivateRoomIdByParticipant = getPrivateRoomIdByParticipant;
exports.getCurrentUserConversations = getCurrentUserConversations;
exports.recordConversations = recordConversations;
exports.authCallback = authCallback;

var _message = require('./message.model');

var _message2 = _interopRequireDefault(_message);

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
 * get room Id based on participants - for private chat only
 */
function getPrivateRoomIdByParticipant(req, res) {
  var currentUser = req.user.userName;
  var recipient = req.user.recipient;
  var keyword = new RegExp(currentUser + '.*' + recipient, "gi");
  return _message2.default.findOne({ roomId: keyword, conversationType: 'private' }, '-conversations').exec().then(function (messages) {
    res.status(200).json({ data: messages });
  }).catch(handleError(res));
}

/**
 * get current user conversations
 */
function getCurrentUserConversations(req, res) {
  var currentUser = req.user.userName;
  return _message2.default.find({ participants: { $in: [currentUser] } }).sort({ updatedAt: 1, conversationType: -1 }).exec().then(function (messages) {
    res.status(200).json({ data: messages });
  }).catch(handleError(res));
}

/**
 * record conversations
 */

function recordConversations(req, res, next) {
  var roomId = req.params.roomId;
  var participants = roomId.split('|');
  var messageAuthor = req.params.messageAuthor;
  var messageContent = req.params.messageContent;
  var conversationType = participants.length === 2 ? 'private' : 'group';

  return _message2.default.findOne({ roomId: roomId }).exec().then(function (message) {
    var conversations = [];
    if (message && message.conversations) {
      conversations = message.conversations;
    }
    conversations.push({
      'author': messageAuthor,
      'content': messageContent,
      'timestamp': new Date()
    });

    return _message2.default.findOneAndUpdate({ 'roomId': roomId }, {
      'roomId': roomId,
      'participants': participants,
      'conversations': conversations,
      'conversationType': conversationType
    }, { upsert: true, 'new': true }).then(function () {
      res.status(204).end();
    }).catch(validationError(res));
  });
}

/**
 * Authentication callback
 */
function authCallback(req, res, next) {
  res.redirect('/');
}
//# sourceMappingURL=message.controller.js.map
