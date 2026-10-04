const mongoose = require('mongoose');

const practiceSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['mcq', 'coding'],
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId
  },
  category: {
    type: String,
    default: 'General'
  },
  title: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 0
  },
  passedCount: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    default: 0
  },
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'javascript'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PracticeSubmission', practiceSubmissionSchema);
