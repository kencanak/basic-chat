'use strict';

class ContactsListController {
  constructor(Auth, $state, User, $http, $scope, socket, Message) {
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

    $scope.$watch(
        "contactsList.searchRes",
        function handleFooChange( newValue, oldValue ) {
            setTimeout(function(){
              $('.tooltipped').tooltip('remove');
              $('.tooltipped').tooltip();
            });

        }
    );

    $scope.$watch(
        "contactsList.contacts",
        function handleFooChange( newValue, oldValue ) {
            setTimeout(function(){
              $('.tooltipped').tooltip('remove');
              $('.tooltipped').tooltip();
            });

        }
    );
  }

  $onInit(){
    $('.modal-trigger').leanModal({
      dismissible: false
    });
    $('.tooltipped').tooltip();

    this.getContactsList();
  }

  getLength(obj) {
    return Object.keys(obj).length;
  }

  getContactsList(){
    this.contacts = [];
    if (this.currentUserContacts && this.currentUserContacts.length > 0)
    {
      this.User.contactsListDetails({contacts: this.currentUserContacts}).$promise.then(response => {
        this.contacts = response.data;
      });
    }
  }

  searchContacts(){
    if (this.keyword)
    {
      this.User.findUserByUserName({keyword: this.keyword,
        page: this.currentPage}).$promise.then(response => {
        this.searchResTotal = Number(response.total);
        this.totalPages = Math.ceil(this.searchResTotal / 5);
        this.searchRes = response.data;
      });
    }
  }

  changePage(page){
    if (page < 1 || page > this.totalPages)
      return false;
    this.currentPage = page;
    this.searchContacts();
  }

  addContacts(userName){
    var contacts = this.currentUserContacts;

    if (contacts.indexOf(userName) > -1)
      return false;

    this.User.addContactsList({
      id: this.getCurrentUser()._id, contact: userName}).$promise.then(response => {

        this.grabLatestContactsList();
        var $toastContent = $('<span>Contact added successfully</span>');
        Materialize.toast($toastContent, 5000);
    });

  }

  deleteContacts(id){
    var contacts = this.currentUserContacts;
    var index = contacts.indexOf(id);
    if (index === -1)
      return false;


    this.User.deleteContactsList({
      id: this.getCurrentUser()._id, contact: id}).$promise.then(response => {

        this.grabLatestContactsList();
        var $toastContent = $('<span>Contact deleted successfully</span>');
        Materialize.toast($toastContent, 5000);
    });
  }

  grabLatestContactsList(){
    this.socket.emit('Update Contacts');
    this.User.get().$promise.then(response => {
      this.currentUserContacts = response.contacts;
      this.getContactsList();
    });
  }

  beginConversation(recipient){
    $('ul.tabs').tabs('select_tab', 'chats');

    //let's look for existing room ID
    this.Message.getPrivateRoomIdByParticipant({recipient: recipient}).$promise.then(response => {

        //let's get the recipient socketId
        var roomId = this.Auth.getCurrentUser().userName + '|' + recipient;

        if (response.data && response.data.roomId){
          roomId = response.data.roomId;
        }

        //let's get the recipient socketId
        this.socket.emit('Begin Chat', {content: "Hi", author: this.Auth.getCurrentUser().userName, roomId: roomId, newMessage: true});
      });
  }
}

angular.module('chatApp')
  .controller('ContactsListController', ContactsListController);
