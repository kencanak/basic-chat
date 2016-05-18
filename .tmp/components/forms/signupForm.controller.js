'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignupFormController = function () {
  //end-non-standard

  function SignupFormController(Auth, $state, $rootScope, $timeout) {
    _classCallCheck(this, SignupFormController);

    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
  }
  //start-non-standard


  _createClass(SignupFormController, [{
    key: 'register',
    value: function register(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.Auth.createUser({
          name: this.user.name,
          userName: this.user.userName,
          password: this.user.password
        }).then(function () {
          // Account created, redirect to home
          var self = _this;
          _this.$timeout(function () {
            self.$rootScope.$broadcast('authenticated');
          }, 100);
          _this.$state.go('chatRoom');
        }).catch(function (err) {
          err = err.data;
          _this.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function (error, field) {
            form[field].$setValidity('mongoose', false);

            _this.errors[field] = error.message;
          });
        });
      }
    }
  }]);

  return SignupFormController;
}();

angular.module('chatApp').controller('SignupFormController', SignupFormController);
//# sourceMappingURL=signupForm.controller.js.map
