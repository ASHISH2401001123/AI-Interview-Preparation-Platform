import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Video, 
  BrainCircuit, 
  Code2, 
  HelpCircle, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Award,
  Terminal,
  MessageSquare
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: BrainCircuit,
      title: 'AI-Powered Interviewer',
      description: 'Simulate realistic Technical and HR interview rounds with dynamic adaptive question flows.'
    },
    {
      icon: Award,
      title: 'Multi-Dimensional Scorecard',
      description: 'Get evaluated on Technical Accuracy, Communication, Relevance, and Confidence scores instantly.'
    },
    {
      icon: Code2,
      title: 'Interactive Coding Sandbox',
      description: 'Solve real-world DSA & algorithm problems with immediate test case execution and feedback.'
    },
    {
      icon: HelpCircle,
      title: 'Technical MCQ Practice',
      description: 'Master core CS subjects including Java, Python, DBMS, OS, Networks, and OOP with timer quizzes.'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Track your preparation trajectory, interview streaks, weak topics, and personalized revision guides.'
    },
    {
      icon: MessageSquare,
      title: 'Model Answer Comparison',
      description: 'Compare your responses against benchmark model answers crafted by industry experts.'
    }
  ];

  const topics = [
    { name: 'Java & Spring', category: 'Language' },
    { name: 'Python & Django', category: 'Language' },
    { name: 'JavaScript & Node.js', category: 'Language' },
    { name: 'Data Structures', category: 'CS Core' },
    { name: 'Algorithms', category: 'CS Core' },
    { name: 'DBMS & SQL', category: 'Database' },
    { name: 'Operating Systems', category: 'Systems' },
    { name: 'Computer Networks', category: 'Networking' },
    { name: 'OOP Principles', category: 'Architecture' },
    { name: 'HR & Behavioral', category: 'HR' },
  ];

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-lg shadow-blue-500/10 animate-bounce">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Next-Gen AI Interview Preparation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-5xl mx-auto">
            Ace Your Tech & HR Interviews with <span className="gradient-text">Real-Time AI Feedback</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Prepare for top tech companies with automated mock interviews, instant scorecard breakdowns, coding practice, and subject-wise MCQs tailored for job seekers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/interview/setup"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base hover:opacity-90 shadow-xl shadow-blue-600/25 flex items-center justify-center gap-3 group transition-all"
            >
              <Video className="w-5 h-5" />
              <span>Start Mock Interview</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/coding"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 font-semibold text-base flex items-center justify-center gap-2.5 transition-all"
            >
              <Code2 className="w-5 h-5 text-indigo-400" />
              <span>Solve Coding Problems</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <div className="text-3xl font-extrabold text-blue-400">20+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Technical MCQs</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <div className="text-3xl font-extrabold text-purple-400">10+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Coding Challenges</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <div className="text-3xl font-extrabold text-emerald-400">Instant</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">AI Scorecard</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <div className="text-3xl font-extrabold text-pink-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Free Practice</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Everything You Need to Land Your <span className="gradient-text">Dream Offer</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Complete end-to-end preparation suite designed specifically for engineering students and job candidates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Topic Badges Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-8 text-center relative overflow-hidden">
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Covering Core Engineering Topics</h3>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Practice interview questions customized for both software roles and HR round scenarios.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {topics.map((t, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 text-sm font-medium hover:border-blue-500/50 hover:text-blue-400 transition-all cursor-default flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/30 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Build Interview Confidence?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            Join thousands of candidates preparing with PrepAI. Start your practice mock interview now.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all shadow-lg"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5 text-slate-900" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
