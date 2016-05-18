'use strict';

(function() {

class ChatRoomController {
  constructor(Auth, $scope, User, socket) {
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
    $(".button-collapse").sideNav({closeOnClick: true});
    $('.modal-trigger').leanModal({
      dismissible: false
    });

    //check for socket send message broadcast
    this.socket.on('New Message', function(param){
      that.newMessage = param.author !== that.getCurrentUser().userName;
    });

    this.socket.on('User Online', function(user){
      if (that.currentUserContacts && that.currentUserContacts.indexOf(user) > -1)
      {
        var $toastContent = $('<span>'+user+' is online</span>');
        Materialize.toast($toastContent, 5000);
      }
    });

    this.socket.on('Update Contacts', function(){
        that.grabLatestContactsList();
    });
  }
  grabLatestContactsList(){
    this.User.get().$promise.then(response => {
      console.log(response.contacts);
      this.currentUserContacts = response.contacts;
    });
  }

  changePassword(form) {
    this.errors = '';
    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          $("#changePasswordModal").closeModal();
          var $toastContent = $('<span>Password changed successfully</span>');
          Materialize.toast($toastContent, 5000);
        })
        .catch(() => {
          this.errors = 'Incorrect password';
        });
    }
  }


  updateStatus(){
    this.User.updateStatus({
      id: this.getCurrentUser()._id, status: this.userStatus.trim()}).$promise.then(response => {
        var $toastContent = $('<span>Status updated successfully</span>');
        Materialize.toast($toastContent, 5000);
    });

  }
}

angular.module('chatApp')
  .controller('ChatRoomController', ChatRoomController);

})();
