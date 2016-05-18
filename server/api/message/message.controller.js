'use strict';

import Message from './message.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**
 * get room Id based on participants - for private chat only
 */
 export function getPrivateRoomIdByParticipant(req,res){
   var currentUser = req.user.userName;
   var recipient = req.user.recipient;
   var keyword = new RegExp(currentUser + '.*' + recipient, "gi");
   return Message.findOne({roomId: keyword, conversationType: 'private'},  '-conversations').exec()
    .then(messages => {
      res.status(200).json({data:messages});
    })
    .catch(handleError(res));
 }

/**
 * get current user conversations
 */
 export function getCurrentUserConversations(req, res){
   var currentUser = req.user.userName;
   return Message.find({participants: {$in:[currentUser]}}).sort({updatedAt:1, conversationType: -1}).exec()
    .then(messages => {
      res.status(200).json({data:messages});
    })
    .catch(handleError(res));
 }

/**
 * record conversations
 */

 export function recordConversations(req, res, next){
   var roomId = req.params.roomId;
   var participants = roomId.split('|');
   var messageAuthor = req.params.messageAuthor;
   var messageContent = req.params.messageContent;
   var conversationType = participants.length === 2 ? 'private' : 'group';

   return Message.findOne({roomId: roomId}).exec()
     .then(message => {
       var conversations = [];
        if (message && message.conversations){
          conversations = message.conversations;
        }
        conversations.push(
          {
            'author': messageAuthor,
            'content': messageContent,
            'timestamp': new Date()
          }
        );

        return Message.findOneAndUpdate({'roomId': roomId}
             ,{
               'roomId': roomId,
               'participants': participants,
               'conversations': conversations,
               'conversationType' : conversationType
             }
             ,{upsert: true, 'new': true}).then(() => {
                 res.status(204).end();
          })
          .catch(validationError(res));
     });
 }

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}
