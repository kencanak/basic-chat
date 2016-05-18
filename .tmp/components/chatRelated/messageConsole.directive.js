'use strict';

angular.module('chatApp').directive('messageConsole', function () {
  return {
    templateUrl: 'components/chatRelated/messageConsole.html',
    restrict: 'E',
    controller: 'messageConsoleController',
    controllerAs: 'messageConsole'
  };
}).directive('scrollBottom', function () {
  return {
    scope: {
      scrollBottom: "="
    },
    link: function link(scope, element) {
      scope.$watchCollection('scrollBottom', function (newValue) {
        if (newValue) {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  };
});
//# sourceMappingURL=messageConsole.directive.js.map
