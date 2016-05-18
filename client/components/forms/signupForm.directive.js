'use strict';

angular.module('chatApp')
  .directive('signupForm', () => ({
    templateUrl: 'components/forms/signupForm.html',
    restrict: 'E',
    controller: 'SignupFormController',
    controllerAs: 'signupForm'
  }));
