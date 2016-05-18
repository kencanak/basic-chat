'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = require('bluebird');


var MessageSchema = new _mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  participants: [{
    type: String
  }],
  conversationType: {
    type: String,
    lowercase: true,
    required: true
  },
  conversations: [{
    author: {
      type: String,
      lowercase: true
    },
    content: {
      type: String
    },
    timestamp: {
      type: Date
    }
  }]
}, {
  timestamps: true
});

exports.default = _mongoose2.default.model('Message', MessageSchema);
//# sourceMappingURL=message.model.js.map
