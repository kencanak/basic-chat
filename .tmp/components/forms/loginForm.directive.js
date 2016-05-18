'use strict';

angular.module('chatApp').directive('loginForm', function () {
  return {
    templateUrl: 'components/forms/loginForm.html',
    restrict: 'E',
    controller: 'LoginFormController',
    controllerAs: 'loginForm'
  };
});
//# sourceMappingURL=loginForm.directive.js.map
