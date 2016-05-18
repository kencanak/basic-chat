'use strict';

angular.module('chatApp')
  .directive('loginForm', () => ({
    templateUrl: 'components/forms/loginForm.html',
    restrict: 'E',
    controller: 'LoginFormController',
    controllerAs: 'loginForm'
  }));
