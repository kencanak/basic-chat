'use strict';

(function() {

function UserResource($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    },
    contactsListDetails: {
      method: 'POST',
      params: {
        contacts: '@contacts'
      },
      url: '/api/users/contactsListDetails/:contacts',
      // isArray: true
    },
    findUserByUserName: {
      method: 'POST',
      params: {
        keyword: '@keyword',
        page: '@page'
      },
      url: '/api/users/findUserByUserName/:keyword/:page',
      // isArray: true
    },
    addContactsList: {
      method: 'POST',
      params: {
        contact: '@contact',
        id: '@id'
      },
      url: '/api/users/addContactsList/:id/:contact',
      // isArray: true
    },
    deleteContactsList: {
      method: 'POST',
      params: {
        contact: '@contact',
        id: '@id'
      },
      url: '/api/users/deleteContactsList/:id/:contact',
      // isArray: true
    },
    updateStatus: {
      method: 'POST',
      params: {
        status: '@status',
        id: '@id'
      },
      url: '/api/users/updateStatus/:id/:status'
    }
  });
}

angular.module('chatApp.auth')
  .factory('User', UserResource);

})();
