const { evaluateInterviewAnswer } = require('../services/aiService');

const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, category = 'General', type = 'Technical' } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required for evaluation' });
    }

    const evaluation = await evaluateInterviewAnswer(question, answer, category, type);
    res.json(evaluation);
  } catch (err) {
    res.status(500).json({ message: 'Error evaluating answer with AI', error: err.message });
  }
};

module.exports = {
  evaluateAnswer
};
