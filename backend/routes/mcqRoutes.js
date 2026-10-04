const express = require('express');
const router = express.Router();
const { getMCQs, submitMCQ } = require('../controllers/mcqController');
const { auth } = require('../middleware/auth');

router.get('/', getMCQs);
router.post('/submit', auth, submitMCQ);

module.exports = router;
