const Interview = require('../models/Interview');
const Question = require('../models/Question');
const { evaluateInterviewAnswer, evaluateFullInterview } = require('../services/aiService');

/**
 * Start a new Interview Session
 */
const createInterview = async (req, res) => {
  try {
    const { type = 'Technical', difficulty = 'Medium', topics = [], questionCount = 5 } = req.body;

    let filter = {};
    if (type === 'Technical') {
      filter.type = 'technical';
    } else if (type === 'HR') {
      filter.type = 'hr';
    }

    if (topics.length > 0) {
      filter.category = { $in: topics };
    }

    let selectedQuestions = await Question.find(filter).limit(Number(questionCount));

    // Fallback if not enough matching questions found
    if (selectedQuestions.length < Number(questionCount)) {
      const remainingCount = Number(questionCount) - selectedQuestions.length;
      const extraQuestions = await Question.find({ _id: { $nin: selectedQuestions.map(q => q._id) } }).limit(remainingCount);
      selectedQuestions = [...selectedQuestions, ...extraQuestions];
    }

    const questionObjects = selectedQuestions.map(q => ({
      questionId: q._id,
      title: q.title,
      description: q.description,
      category: q.category,
      type: q.type
    }));

    const newInterview = new Interview({
      userId: req.user.id,
      type,
      difficulty,
      topics,
      questions: questionObjects,
      answers: [],
      status: 'in_progress'
    });

    await newInterview.save();
    res.status(201).json(newInterview);
  } catch (err) {
    res.status(500).json({ message: 'Error creating interview session', error: err.message });
  }
};

/**
 * Get all interviews for logged-in user
 */
const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id }).sort({ startedAt: -1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching interviews', error: err.message });
  }
};

/**
 * Get single interview by ID
 */
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found' });
    }
    // Verify ownership or admin
    if (interview.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied to this interview' });
    }
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching interview details', error: err.message });
  }
};

/**
 * Submit answer for an interview question
 */
const answerQuestion = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const currentQuestion = interview.questions[questionIndex];
    if (!currentQuestion) {
      return res.status(400).json({ message: 'Invalid question index' });
    }

    // Call AI Evaluation Service for this single answer
    const aiResult = await evaluateInterviewAnswer(
      currentQuestion.title,
      answer,
      currentQuestion.category,
      currentQuestion.type
    );

    const answerData = {
      questionIndex,
      questionText: currentQuestion.title,
      answer,
      evaluation: aiResult.feedback || (aiResult.strengths ? aiResult.strengths.join('. ') : ''),
      score: aiResult.score,
      feedback: aiResult.suggestions ? aiResult.suggestions.join('. ') : '',
      improvedAnswer: aiResult.improvedAnswer || ''
    };

    // Check if answer for questionIndex already exists, update or push
    const existingIndex = interview.answers.findIndex(a => a.questionIndex === Number(questionIndex));
    if (existingIndex > -1) {
      interview.answers[existingIndex] = answerData;
    } else {
      interview.answers.push(answerData);
    }

    await interview.save();

    res.json({
      message: 'Answer saved and evaluated',
      answer: answerData,
      evaluation: aiResult
    });
  } catch (err) {
    res.status(500).json({ message: 'Error saving answer', error: err.message });
  }
};

/**
 * Complete interview and perform final AI evaluation
 */
const completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Perform overall AI evaluation
    const summary = await evaluateFullInterview(interview);

    interview.score = summary.score || 75;
    interview.technicalScore = summary.technicalScore || 75;
    interview.communicationScore = summary.communicationScore || 75;
    interview.relevanceScore = summary.relevanceScore || 75;
    interview.confidenceScore = summary.confidenceScore || 75;
    interview.strengths = summary.strengths || [];
    interview.weaknesses = summary.weaknesses || [];
    interview.suggestions = summary.suggestions || [];
    interview.topicsToRevise = summary.topicsToRevise || [];
    interview.status = 'completed';
    interview.completedAt = new Date();

    await interview.save();

    res.json({
      message: 'Interview completed successfully',
      interview
    });
  } catch (err) {
    res.status(500).json({ message: 'Error completing interview', error: err.message });
  }
};

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById,
  answerQuestion,
  completeInterview
};
