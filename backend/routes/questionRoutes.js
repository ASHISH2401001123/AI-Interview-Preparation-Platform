const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', auth, adminOnly, createQuestion);
router.put('/:id', auth, adminOnly, updateQuestion);
router.delete('/:id', auth, adminOnly, deleteQuestion);

module.exports = router;
