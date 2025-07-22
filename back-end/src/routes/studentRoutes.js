import express from 'express';
import {
  sendLoginEmail,
  validateEmailCode,
  getLessons,
  markLessonDone,
  editProfile,
  setupEmail
} from '../controllers/studentController.js';

const router = express.Router();

router.post('/loginEmail', sendLoginEmail);//
router.post('/validateAccessCode', validateEmailCode);//
router.get('/myLessons', getLessons);//
router.post('/markLessonDone', markLessonDone);//
router.put('/editProfile', editProfile);//
router.post('/setupEmail', setupEmail); //
export default router;

