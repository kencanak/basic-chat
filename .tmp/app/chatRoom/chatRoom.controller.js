'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ChatRoomController = function () {
    function ChatRoomController(Auth, $scope, User, socket) {
      _classCallCheck(this, ChatRoomController);

      this.Auth = Auth;
      this.isLoggedIn = Auth.isLoggedIn;
      this.getCurrentUser = Auth.getCurrentUser;
      this.userStatus = this.getCurrentUser().status;
      this.User = User;
      this.user = {};
      this.errors = null;
      this.socket = socket.socket;
      this.currentUserContacts = this.getCurrentUser().contacts;
      this.newMessage = false;
      var that = this;

      $('ul.tabs').tabs();
      $(".button-collapse").sideNav({ closeOnClick: true });
      $('.modal-trigger').leanModal({
        dismissible: false
      });

      //check for socket send message broadcast
      this.socket.on('New Message', function (param) {
        that.newMessage = param.author !== that.getCurrentUser().userName;
      });

      this.socket.on('User Online', function (user) {
        if (that.currentUserContacts && that.currentUserContacts.indexOf(user) > -1) {
          var $toastContent = $('<span>' + user + ' is online</span>');
          Materialize.toast($toastContent, 5000);
        }
      });

      this.socket.on('Update Contacts', function () {
        that.grabLatestContactsList();
      });
    }

    _createClass(ChatRoomController, [{
      key: 'grabLatestContactsList',
      value: function grabLatestContactsList() {
        var _this = this;

        this.User.get().$promise.then(function (response) {
          console.log(response.contacts);
          _this.currentUserContacts = response.contacts;
        });
      }
    }, {
      key: 'changePassword',
      value: function changePassword(form) {
        var _this2 = this;

        this.errors = '';
        if (form.$valid) {
          this.Auth.changePassword(this.user.oldPassword, this.user.newPassword).then(function () {
            $("#changePasswordModal").closeModal();
            var $toastContent = $('<span>Password changed successfully</span>');
            Materialize.toast($toastContent, 5000);
          }).catch(function () {
            _this2.errors = 'Incorrect password';
          });
        }
      }
    }, {
      key: 'updateStatus',
      value: function updateStatus() {
        this.User.updateStatus({
          id: this.getCurrentUser()._id, status: this.userStatus.trim() }).$promise.then(function (response) {
          var $toastContent = $('<span>Status updated successfully</span>');
          Materialize.toast($toastContent, 5000);
        });
      }
    }]);

    return ChatRoomController;
  }();

  angular.module('chatApp').controller('ChatRoomController', ChatRoomController);
})();
//# sourceMappingURL=chatRoom.controller.js.map
