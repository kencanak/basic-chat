'use strict';

(function() {

function MessageResource($resource) {
  return $resource('/api/messages/:id/:controller', {
    id: '@_id'
  },
  {
    getCurrentUserConversations: {
      method: 'GET',
      url: '/'
    },
    getPrivateRoomIdByParticipant: {
      method: 'POST',
      params: {
        recipient: '@recipient'
      },
      url: '/api/messages/getPrivateRoomIdByParticipant/:recipient'
    },
    recordConversations: {
      method: 'POST',
      params: {
        roomId: '@roomId',
        messageAuthor: '@messageAuthor',
        messageContent: '@messageContent'
      },
      url: '/api/messages/recordConversations/:roomId/:messageAuthor/:messageContent'
    }
  });
}

angular.module('chatApp.auth')
  .factory('Message', MessageResource);

})();
