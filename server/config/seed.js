/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Message from '../api/message/message.model';

Message.find({}).remove().then(()=>{
  
});
User.find({}).remove()
  .then(() => {
    User.create({
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
    },
    {
      provider: 'local',
      name: 'Kencana',
      userName: 'kencana',
      password: 'kencana'
    },
    {
      provider: 'local',
      name: 'Alex',
      userName: 'alex',
      password: 'alex'
    },
    {
      provider: 'local',
      name: 'Axl',
      userName: 'axl',
      password: 'axl'
    },
    {
      provider: 'local',
      name: 'Amber',
      userName: 'amber',
      password: 'amber'
    },
    {
      provider: 'local',
      name: 'Anna',
      userName: 'anna',
      password: 'anna'
    },
    {
      provider: 'local',
      name: 'Anton',
      userName: 'antongah',
      password: 'antongah'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
