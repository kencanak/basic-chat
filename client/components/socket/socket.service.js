/* global io */
'use strict';

angular.module('chatApp')
  .factory('socket', function(socketFactory, Auth, $rootScope) {
    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      'query': 'token=' + Auth.getToken(),
      path: '/socket.io-client'
    });
    
    // listen for the authenticated event emitted on the rootScope of
    // the Angular app. Once the event is fired, create the socket and resolve
    // the promise.
    $rootScope.$on('authenticated', function() {
      ioSocket = io('', {
        // Send auth token on connection, you will need to DI the Auth service above
        forceNew: true,
        query: 'token=' + Auth.getToken(),
        path: '/socket.io-client'
      });
    });

    var socket = socketFactory({ ioSocket });

    return {
      socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates(modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates(modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  });
