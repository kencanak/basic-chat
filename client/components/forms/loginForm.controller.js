'use strict';

class LoginFormController {
  constructor(Auth, $state, $rootScope, $timeout) {
    this.user = {};
    this.errors = {};
    this.submitted = false;
    this.$timeout = $timeout;

    this.Auth = Auth;
    this.$state = $state;
    this.$rootScope = $rootScope;
  }


  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        userName: this.user.userName,
        password: this.user.password
      })
      .then(() => {
        var self = this;
        // Logged in, redirect to home
        this.$timeout(function(){
            self.$rootScope.$broadcast('authenticated');
        },100);

        this.$state.go('chatRoom');
      })
      .catch(err => {
        console.log(err);
        this.errors.other = err.message;
      });
    }
  }
}

angular.module('chatApp')
  .controller('LoginFormController', LoginFormController);
