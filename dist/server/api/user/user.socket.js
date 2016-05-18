/**
 * Broadcast updates to client
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;

var _user = require('./user.events');

var _user2 = _interopRequireDefault(_user);

var _user3 = require('./user.model');

var _user4 = _interopRequireDefault(_user3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function register(socket) {
  var params = {
    "user": {
      "socketId": socket.id,
      "_id": socket.decoded_token._id
    }
  };

  //on connected let's update the socket ID
  updateSocketId(params);
  //broadcast some one is online
  socket.broadcast.emit('User Online', socket.decoded_token.userName);

  socket.on('disconnect', function () {
    updateSocketId(params);
  });
}

function updateSocketId(req) {
  var socketId = req.user.socketId;
  var id = req.user._id;

  _user4.default.findById(id).exec().then(function (user) {
    user.socketId = socketId;
    return user.save().then(function () {
      return true;
    }).catch(function (err) {
      console.log(err);
    });
  });
}
//# sourceMappingURL=user.socket.js.map
