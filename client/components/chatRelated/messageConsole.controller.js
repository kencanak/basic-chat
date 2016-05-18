'use strict';

class messageConsoleController {
  constructor(Auth, $state, socket, Message, User, $scope, $timeout) {
    this.user = {};
    this.errors = {};
    this.submitted = false;
    this.message = "";

    this.socket = socket.socket;

    this.Message = Message;
    this.User = User;
    this.Auth = Auth;
    this.$state = $state;
    this.$timeout = $timeout;

    this.currentConversation = [];
    this.conversationMessagesLocal = {};
    this.currentChatRoomId = null;
    this.chatDetails = null;
    this.totalUnread = 0;

    var self = this;


    //probably this is the worst idea to reinit the tooltip. need to look for a proper Materialize directive

    $scope.$watch(
        "messageConsole.currentConversation",
        function handleFooChange( newValue, oldValue ) {
            setTimeout(function(){
              $('.tooltipped').tooltip('remove');
              $('.tooltipped').tooltip();
            });

        }
    );

    //check for socket send message broadcast
    this.socket.on('Send Message', function(param){
      var msg = {
        'author': param.author,
        'content': param.content,
        'timestamp': new Date()
      };

      //just need to update local message, this is nasty
      if (!self.conversationMessagesLocal[param.roomId]){
          var participants = param.roomId.split('|');
          var newEntry = {
            'roomId': param.roomId,
            'participants': participants,
            'recipient': _.difference(participants, [self.Auth.getCurrentUser().userName])[0],
            'conversations': [],
            'unread': msg.author === self.Auth.getCurrentUser().userName ? false : true
          }
          self.conversationMessagesLocal[param.roomId] = newEntry;

          self.currentConversation.push(newEntry);
      }
      self.conversationMessagesLocal[param.roomId].unread = msg.author === self.Auth.getCurrentUser().userName ? false : true;
      self.conversationMessagesLocal[param.roomId].conversations.push(msg);

      // self.chatDetails = self.conversationMessagesLocal[param.roomId];

      // self.loadSelectedConversation(param.roomId);

      //record conversation into database
      if (msg.author === self.Auth.getCurrentUser().userName){
        self.Message.recordConversations({
            roomId: param.roomId, messageAuthor: param.author, messageContent: param.content}).$promise.then(response => {
          });
      }

    });
  }

  getLength(obj) {
    return Object.keys(obj).length;
  }


  $onInit(){
    var self = this;
    this.$timeout(function(){
      self.getCurrentUserConversations();
      self.socket.emit("test");
    }, 100);

  }

  formatDate(date){
    return moment(date).format('DD-MM-YYYY hh:mm a');
  }

  loadSelectedConversation(roomId){
    if (!roomId && this.currentConversation.length > 0){
      roomId = this.currentConversation[0].roomId;
    }

    if (this.conversationMessagesLocal[roomId]){
        this.conversationMessagesLocal[roomId].unread = false;
    }

    this.currentChatRoomId = roomId;
    this.chatDetails = this.conversationMessagesLocal[roomId];
  }

  getCurrentUserConversations(){
    var self = this;
    this.Message.get().$promise.then(response => {
      var massagedData = [];
      //need to massage the response data, adding in recipient details. nasty

      _(response.data).forEach(function(value) {
        var recipient = _.difference(value.participants, [self.Auth.getCurrentUser().userName]);
        value.recipient = recipient[0];

        self.conversationMessagesLocal[value.roomId] = value;
        massagedData.push(value);

        //need to join each roomId
        self.socket.emit('Join Rooms', {roomId: value.roomId});
      });


      this.currentConversation = massagedData;
      this.loadSelectedConversation();
    });
  }

  sendMessage(){
    this.socket.emit('Begin Chat', {content: this.message, author: this.Auth.getCurrentUser().userName, roomId: this.currentChatRoomId, newMessage: true});

    this.message = '';
  }
}

angular.module('chatApp')
  .controller('messageConsoleController', messageConsoleController);
