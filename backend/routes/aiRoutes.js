const express = require('express');
const router = express.Router();
const { evaluateAnswer } = require('../controllers/aiController');
const { auth } = require('../middleware/auth');

router.post('/evaluate', auth, evaluateAnswer);

module.exports = router;
