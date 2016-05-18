'use strict';

angular.module('chatApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('logout', {
        url: '/logout?referrer',
        referrer: 'main',
        template: '',
        controller: function($state, Auth, socket) {
          var referrer = $state.params.referrer ||
                          $state.current.referrer ||
                          'main';
          socket.socket.disconnect();
          Auth.logout();
          $state.go(referrer);
        }
      })
      .state('chatRoom', {
        url: '/chatRoom',
        templateUrl: 'app/chatRoom/chatRoom.html',
        controller: 'ChatRoomController',
        controllerAs: 'chatRoom',
        authenticate: true
      });
  })
  .run(function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  });
