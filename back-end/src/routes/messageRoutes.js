import express from 'express';
import {
  getMessages,
  getConversations,
  getOppositeRoleUsers
} from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getMessages);//
router.get('/conversations/:userId', getConversations);//
router.get('/opposite-users', getOppositeRoleUsers);//
export default router;