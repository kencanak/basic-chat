'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

router.post('/contactsListDetails/:contacts', auth.isAuthenticated(), controller.contactsListDetails);
router.post('/findUserByUserName/:keyword/:page', auth.isAuthenticated(), controller.findUserByUserName);
router.post('/addContactsList/:id/:contact', auth.isAuthenticated(), controller.addContactsList);
router.post('/deleteContactsList/:id/:contact', auth.isAuthenticated(), controller.deleteContactsList);
router.post('/updateStatus/:id/:status', auth.isAuthenticated(), controller.updateStatus);

module.exports = router;
