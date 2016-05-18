'use strict';

class SignupFormController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, $state, $rootScope, $timeout) {
    this.Auth = Auth;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
  }

  register(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.createUser({
        name: this.user.name,
        userName: this.user.userName,
        password: this.user.password
      })
      .then(() => {
        // Account created, redirect to home
        var self = this;
        this.$timeout(function(){
            self.$rootScope.$broadcast('authenticated');
        },100);
        this.$state.go('chatRoom');
      })
      .catch(err => {
        err = err.data;
        this.errors = {};

        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);

          this.errors[field] = error.message;
        });
      });
    }
  }
}

angular.module('chatApp')
  .controller('SignupFormController', SignupFormController);
