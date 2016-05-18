'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginFormController = function () {
  function LoginFormController(Auth, $state, $rootScope, $timeout) {
    _classCallCheck(this, LoginFormController);

    this.user = {};
    this.errors = {};
    this.submitted = false;
    this.$timeout = $timeout;

    this.Auth = Auth;
    this.$state = $state;
    this.$rootScope = $rootScope;
  }

  _createClass(LoginFormController, [{
    key: 'login',
    value: function login(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.Auth.login({
          userName: this.user.userName,
          password: this.user.password
        }).then(function () {
          var self = _this;
          // Logged in, redirect to home
          _this.$timeout(function () {
            self.$rootScope.$broadcast('authenticated');
          }, 100);

          _this.$state.go('chatRoom');
        }).catch(function (err) {
          console.log(err);
          _this.errors.other = err.message;
        });
      }
    }
  }]);

  return LoginFormController;
}();

angular.module('chatApp').controller('LoginFormController', LoginFormController);
//# sourceMappingURL=loginForm.controller.js.map
