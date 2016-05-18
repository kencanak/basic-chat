/**
 * Broadcast updates to client
 */

'use strict';

import UserEvents from './user.events';
import User from './user.model';

export function register(socket) {
  var params = {
    "user":{
      "socketId": socket.id,
      "_id": socket.decoded_token._id
    }
  };

  //on connected let's update the socket ID
  updateSocketId(params);
  //broadcast some one is online
  socket.broadcast.emit('User Online', socket.decoded_token.userName);

  socket.on('disconnect', function(){
    updateSocketId(params);
  });
}

function updateSocketId(req)
{
  var socketId = req.user.socketId;
  var id = req.user._id;

  User.findById(id).exec()
    .then(user => {
      user.socketId = socketId;
      return user.save()
        .then(() => {
          return true;
        })
        .catch(err => {
          console.log(err);
        });
    });
}
