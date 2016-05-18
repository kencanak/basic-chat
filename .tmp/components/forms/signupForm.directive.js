'use strict';

angular.module('chatApp').directive('signupForm', function () {
  return {
    templateUrl: 'components/forms/signupForm.html',
    restrict: 'E',
    controller: 'SignupFormController',
    controllerAs: 'signupForm'
  };
});
//# sourceMappingURL=signupForm.directive.js.map
