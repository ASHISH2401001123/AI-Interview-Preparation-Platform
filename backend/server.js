const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');
const mcqRoutes = require('./routes/mcqRoutes');
const codingRoutes = require('./routes/codingRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const aiRoutes = require('./routes/aiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/mcq', mcqRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AI Interview Preparation Platform API is running',
    timestamp: new Date()
  });
});

// Global 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

const connectDBAndStartServer = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_interview_prep';
  
  try {
    // Attempt connecting to configured MongoDB
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
    console.log('Successfully connected to MongoDB Database');
  } catch (err) {
    console.log('Local MongoDB not accessible. Initializing MongoMemoryServer fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`Connected to MongoMemoryServer at ${inMemoryUri}`);
    } catch (memErr) {
      console.error('Failed to start MongoMemoryServer:', memErr);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`API Endpoints accessible at http://localhost:${PORT}/api/health`);
  });
};

connectDBAndStartServer();
