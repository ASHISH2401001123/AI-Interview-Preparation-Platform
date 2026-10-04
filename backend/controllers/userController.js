const User = require('../models/User');
const Interview = require('../models/Interview');
const PracticeSubmission = require('../models/PracticeSubmission');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const interviews = await Interview.find({ userId: req.user.id, status: 'completed' });
    const codingSubmissions = await PracticeSubmission.find({ userId: req.user.id, type: 'coding', passedCount: { $gt: 0 } });
    const mcqSubmissions = await PracticeSubmission.find({ userId: req.user.id, type: 'mcq' });

    const totalInterviews = interviews.length;
    const avgScore = totalInterviews > 0
      ? Math.round(interviews.reduce((a, c) => a + (c.score || 0), 0) / totalInterviews)
      : 0;

    res.json({
      user,
      stats: {
        totalInterviews,
        avgScore,
        codingSolved: new Set(codingSubmissions.map(s => s.questionId?.toString())).size,
        mcqsAttempted: mcqSubmissions.reduce((a, c) => a + (c.totalCount || 0), 0)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, skills } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (skills && Array.isArray(skills)) user.skills = skills;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(users.map(async (u) => {
      const interviewCount = await Interview.countDocuments({ userId: u._id, status: 'completed' });
      return {
        ...u.toObject(),
        interviewCount
      };
    }));

    res.json(usersWithStats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers
};
