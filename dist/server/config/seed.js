/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var _user = require('../api/user/user.model');

var _user2 = _interopRequireDefault(_user);

var _message = require('../api/message/message.model');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_message2.default.find({}).remove().then(function () {});
_user2.default.find({}).remove().then(function () {
  _user2.default.create({
    provider: 'local',
    name: 'Test User',
    userName: 'testuser',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    userName: 'admin',
    password: 'admin'
  }, {
    provider: 'local',
    name: 'Kencana',
    userName: 'kencana',
    password: 'kencana'
  }, {
    provider: 'local',
    name: 'Alex',
    userName: 'alex',
    password: 'alex'
  }, {
    provider: 'local',
    name: 'Axl',
    userName: 'axl',
    password: 'axl'
  }, {
    provider: 'local',
    name: 'Amber',
    userName: 'amber',
    password: 'amber'
  }, {
    provider: 'local',
    name: 'Anna',
    userName: 'anna',
    password: 'anna'
  }, {
    provider: 'local',
    name: 'Anton',
    userName: 'antongah',
    password: 'antongah'
  }).then(function () {
    console.log('finished populating users');
  });
});
//# sourceMappingURL=seed.js.map
