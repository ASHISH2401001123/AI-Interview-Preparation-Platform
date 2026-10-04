const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  questionText: { type: String, required: true },
  answer: { type: String, default: '' },
  evaluation: { type: String, default: '' },
  score: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
  improvedAnswer: { type: String, default: '' }
}, { _id: false });

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Technical', 'HR', 'Mixed'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  topics: [String],
  questions: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    type: { type: String, default: 'technical' }
  }],
  answers: [answerSchema],
  score: { type: Number, default: 0 },
  technicalScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  relevanceScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 0 },
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
  topicsToRevise: [String],
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
