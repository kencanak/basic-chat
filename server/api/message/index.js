'use strict';

import {Router} from 'express';
import * as controller from './message.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.isAuthenticated(), controller.getCurrentUserConversations);
// router.delete('/:id', auth.hasRole('admin'), controller.destroy);
// router.get('/me', auth.isAuthenticated(), controller.me);
// router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.post('/getPrivateRoomIdByParticipant/:recipient', auth.isAuthenticated(), controller.getPrivateRoomIdByParticipant);
router.post('/recordConversations/:roomId/:messageAuthor/:messageContent', auth.isAuthenticated(), controller.recordConversations);

module.exports = router;
