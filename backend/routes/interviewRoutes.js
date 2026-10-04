const express = require('express');
const router = express.Router();
const {
  createInterview,
  getInterviews,
  getInterviewById,
  answerQuestion,
  completeInterview
} = require('../controllers/interviewController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createInterview);
router.get('/', auth, getInterviews);
router.get('/:id', auth, getInterviewById);
router.post('/:id/answer', auth, answerQuestion);
router.post('/:id/complete', auth, completeInterview);

module.exports = router;
