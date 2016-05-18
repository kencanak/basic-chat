'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContactsListController = function () {
  function ContactsListController(Auth, $state, User, $http, $scope, socket, Message) {
    _classCallCheck(this, ContactsListController);

    this.$http = $http;
    this.User = User;
    this.Message = Message;
    this.socket = socket.socket;
    this.$scope = $scope;

    this.Auth = Auth;
    this.isLoggedIn = Auth.isLoggedIn;
    this.getCurrentUser = Auth.getCurrentUser;
    this.$state = $state;
    this.keyword = '';
    this.searchRes = [];
    this.searchResTotal = 0;
    this.totalPages = 0;
    this.range = _.range;
    this.currentPage = 1;
    this.contacts = [];
    this.currentUserContacts = this.getCurrentUser().contacts;

    //probably this is the worst idea to reinit the tooltip. need to look for a proper Materialize directive

    $scope.$watch("contactsList.searchRes", function handleFooChange(newValue, oldValue) {
      setTimeout(function () {
        $('.tooltipped').tooltip('remove');
        $('.tooltipped').tooltip();
      });
    });

    $scope.$watch("contactsList.contacts", function handleFooChange(newValue, oldValue) {
      setTimeout(function () {
        $('.tooltipped').tooltip('remove');
        $('.tooltipped').tooltip();
      });
    });
  }

  _createClass(ContactsListController, [{
    key: '$onInit',
    value: function $onInit() {
      $('.modal-trigger').leanModal({
        dismissible: false
      });
      $('.tooltipped').tooltip();

      this.getContactsList();
    }
  }, {
    key: 'getLength',
    value: function getLength(obj) {
      return Object.keys(obj).length;
    }
  }, {
    key: 'getContactsList',
    value: function getContactsList() {
      var _this = this;

      this.contacts = [];
      if (this.currentUserContacts && this.currentUserContacts.length > 0) {
        this.User.contactsListDetails({ contacts: this.currentUserContacts }).$promise.then(function (response) {
          _this.contacts = response.data;
        });
      }
    }
  }, {
    key: 'searchContacts',
    value: function searchContacts() {
      var _this2 = this;

      if (this.keyword) {
        this.User.findUserByUserName({ keyword: this.keyword,
          page: this.currentPage }).$promise.then(function (response) {
          _this2.searchResTotal = Number(response.total);
          _this2.totalPages = Math.ceil(_this2.searchResTotal / 5);
          _this2.searchRes = response.data;
        });
      }
    }
  }, {
    key: 'changePage',
    value: function changePage(page) {
      if (page < 1 || page > this.totalPages) return false;
      this.currentPage = page;
      this.searchContacts();
    }
  }, {
    key: 'addContacts',
    value: function addContacts(userName) {
      var _this3 = this;

      var contacts = this.currentUserContacts;

      if (contacts.indexOf(userName) > -1) return false;

      this.User.addContactsList({
        id: this.getCurrentUser()._id, contact: userName }).$promise.then(function (response) {

        _this3.grabLatestContactsList();
        var $toastContent = $('<span>Contact added successfully</span>');
        Materialize.toast($toastContent, 5000);
      });
    }
  }, {
    key: 'deleteContacts',
    value: function deleteContacts(id) {
      var _this4 = this;

      var contacts = this.currentUserContacts;
      var index = contacts.indexOf(id);
      if (index === -1) return false;

      this.User.deleteContactsList({
        id: this.getCurrentUser()._id, contact: id }).$promise.then(function (response) {

        _this4.grabLatestContactsList();
        var $toastContent = $('<span>Contact deleted successfully</span>');
        Materialize.toast($toastContent, 5000);
      });
    }
  }, {
    key: 'grabLatestContactsList',
    value: function grabLatestContactsList() {
      var _this5 = this;

      this.socket.emit('Update Contacts');
      this.User.get().$promise.then(function (response) {
        _this5.currentUserContacts = response.contacts;
        _this5.getContactsList();
      });
    }
  }, {
    key: 'beginConversation',
    value: function beginConversation(recipient) {
      var _this6 = this;

      $('ul.tabs').tabs('select_tab', 'chats');

      //let's look for existing room ID
      this.Message.getPrivateRoomIdByParticipant({ recipient: recipient }).$promise.then(function (response) {

        //let's get the recipient socketId
        var roomId = _this6.Auth.getCurrentUser().userName + '|' + recipient;

        if (response.data && response.data.roomId) {
          roomId = response.data.roomId;
        }

        //let's get the recipient socketId
        _this6.socket.emit('Begin Chat', { content: "Hi", author: _this6.Auth.getCurrentUser().userName, roomId: roomId, newMessage: true });
      });
    }
  }]);

  return ContactsListController;
}();

angular.module('chatApp').controller('ContactsListController', ContactsListController);
//# sourceMappingURL=contactsList.controller.js.map
