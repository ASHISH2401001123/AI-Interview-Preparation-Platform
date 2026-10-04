const express = require('express');
const router = express.Router();
const {
  getCodingQuestions,
  getCodingQuestionById,
  createCodingQuestion,
  updateCodingQuestion,
  deleteCodingQuestion,
  submitCode
} = require('../controllers/codingController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getCodingQuestions);
router.get('/:id', getCodingQuestionById);
router.post('/', auth, adminOnly, createCodingQuestion);
router.put('/:id', auth, adminOnly, updateCodingQuestion);
router.delete('/:id', auth, adminOnly, deleteCodingQuestion);
router.post('/submit', auth, submitCode);

module.exports = router;
