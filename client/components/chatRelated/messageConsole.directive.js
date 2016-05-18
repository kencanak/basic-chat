'use strict';

angular.module('chatApp')
  .directive('messageConsole', () => ({
    templateUrl: 'components/chatRelated/messageConsole.html',
    restrict: 'E',
    controller: 'messageConsoleController',
    controllerAs: 'messageConsole'
  }))
  .directive('scrollBottom', function () {
    return {
      scope: {
        scrollBottom: "="
      },
      link: function (scope, element) {
        scope.$watchCollection('scrollBottom', function (newValue) {
          if (newValue)
          {
            $(element).scrollTop($(element)[0].scrollHeight);
          }
        });
      }
    }
  });
