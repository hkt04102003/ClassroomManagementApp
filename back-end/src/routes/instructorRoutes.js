import express from 'express';
import {
  addStudent,
  assignLesson,
  getStudents,
  editStudent,
  deleteStudent,
  sendLoginEmail,
  validateEmailCode,
  getLessons,
  deleteLesson,
  editLesson
} from '../controllers/instructorController.js';

const router = express.Router();
router.post('/loginEmail', sendLoginEmail);//
router.post('/validateAccessCode', validateEmailCode);//
router.post('/addStudent', addStudent);//
router.post('/assignLesson', assignLesson);//
router.get('/lessons', getLessons);//
router.get('/students', getStudents);//
router.put('/editStudent/', editStudent);//
router.delete('/student', deleteStudent); //
router.delete('/lesson', deleteLesson); //
router.put('/editLesson', editLesson); //
export default router;
