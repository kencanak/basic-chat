'use strict';

import User from './user.model';
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
 * update socket Id for the particular user
 */
export function updateSocketId(req, res)
{
  var socketId = req.user.socketId;
  var id = req.user._id;

  return User.findById(id).exec()
    .then(user => {
      user.socketId = socketId;
      return user.save()
        .then(() => {
          res.status(204).end();
        })
        .catch(validationError(res));
    });
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Get list of users based on usernames
 */
 export function contactsListDetails(req, res){
   var contacts = req.params.contacts.split(",");
   return User.find({userName:{$in: contacts}}, '-salt -password -contacts').exec()
      .then(contacts => {
        res.status(200).json({data:contacts});
      })
      .catch(handleError(res));
 }

 /**
  * get list of users based on keywords search
  */

 export function findUserByUserName(req, res){
   var keyword = new RegExp("^" + req.params.keyword, "gi");
   var page = (Number(req.params.page) - 1) * 5;
   var currentUser = req.user.userName;

   var queryContructor = {
     $or:
      [
        {
          userName:{
            $regex: keyword
          }
        },
        {
          name:{
            $regex: keyword
          }
        }
      ],
      userName:{
        $nin:currentUser
      }
    };

   return User.find(queryContructor, '-salt -password -contacts').exec()
    .then(usersTotal => {
      return User.find(queryContructor, '-salt -password -contacts').skip(page).limit(5).sort({userName:1, name: 1}).exec()
       .then(users => {
         res.status(200).json({data:users, total: usersTotal.length});
       })
       .catch(handleError(res));

    })
    .catch(handleError(res));
 }

 /**
  * add user contacts' list
  */
export function addContactsList(req,res){
  var contact = req.params.contact;
  var id = req.params.id;

  return User.findById(id).exec()
    .then(user => {
      user.contacts.push(contact);
      return user.save()
        .then(() => {
          res.status(204).end();
        })
        .catch(validationError(res));
    });
}

/**
 * delete user contacts' list
 */
export function deleteContactsList(req,res){
 var contact = req.params.contact;
 var id = req.params.id;

 return User.findById(id).exec()
   .then(user => {
     var index = user.contacts.indexOf(contact);
     user.contacts.splice(index,1);
     return user.save()
       .then(() => {
         res.status(204).end();
       })
       .catch(validationError(res));
   });
}

/**
 * update status
 */
export function updateStatus(req,res){
 var status = req.params.status;
 var id = req.params.id;

 return User.findById(id).exec()
   .then(user => {
     user.status = status;
     return user.save()
       .then(() => {
         res.status(204).end();
       })
       .catch(validationError(res));
   });
}


/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}
