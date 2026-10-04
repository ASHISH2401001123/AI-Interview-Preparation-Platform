const Question = require('../models/Question');

const getQuestions = async (req, res) => {
  try {
    const { type, category, difficulty } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching questions', error: err.message });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching question', error: err.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { title, description, category, difficulty, type, options, correctAnswer, explanation } = req.body;
    if (!title || !category || !type) {
      return res.status(400).json({ message: 'Title, category, and type are required' });
    }

    const question = new Question({
      title,
      description,
      category,
      difficulty,
      type,
      options,
      correctAnswer,
      explanation
    });

    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Error creating question', error: err.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Error updating question', error: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting question', error: err.message });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
