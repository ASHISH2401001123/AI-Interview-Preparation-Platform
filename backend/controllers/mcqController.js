const Question = require('../models/Question');
const PracticeSubmission = require('../models/PracticeSubmission');

const getMCQs = async (req, res) => {
  try {
    const { category, difficulty, limit = 10 } = req.query;
    const filter = { type: 'mcq' };
    if (category && category !== 'All') filter.category = category;
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;

    const mcqs = await Question.find(filter).limit(Number(limit));
    res.json(mcqs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching MCQs', error: err.message });
  }
};

const submitMCQ = async (req, res) => {
  try {
    const { answers, category = 'General' } = req.body; // answers: [{ questionId, selectedIndex }]
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers array is required' });
    }

    let correctCount = 0;
    const results = [];

    for (const item of answers) {
      const q = await Question.findById(item.questionId);
      if (!q) continue;

      const isCorrect = Number(item.selectedIndex) === Number(q.correctAnswer);
      if (isCorrect) correctCount++;

      results.push({
        questionId: q._id,
        title: q.title,
        options: q.options,
        selectedIndex: item.selectedIndex,
        correctIndex: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        category: q.category
      });
    }

    const totalCount = results.length;
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    // Save submission record if user is authenticated
    if (req.user && req.user.id) {
      const submission = new PracticeSubmission({
        userId: req.user.id,
        type: 'mcq',
        category,
        title: `${category} MCQ Practice`,
        score: percentage,
        passedCount: correctCount,
        totalCount: totalCount
      });
      await submission.save();
    }

    res.json({
      score: percentage,
      correctCount,
      totalCount,
      results
    });
  } catch (err) {
    res.status(500).json({ message: 'Error processing MCQ submission', error: err.message });
  }
};

module.exports = {
  getMCQs,
  submitMCQ
};
