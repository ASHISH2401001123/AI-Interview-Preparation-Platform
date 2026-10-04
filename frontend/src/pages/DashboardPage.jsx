import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Video,
  Award,
  Code2,
  HelpCircle,
  Flame,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Loader2,
  Sparkles,
  Calendar,
  ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardAPI.getStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading Dashboard Analytics...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Interviews Completed',
      value: stats?.completedInterviewsCount || 0,
      icon: Video,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Mock Rounds'
    },
    {
      title: 'Average Score',
      value: `${stats?.avgScore || 0}%`,
      icon: Award,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Overall Rating'
    },
    {
      title: 'Coding Solved',
      value: stats?.codingQuestionsSolved || 0,
      icon: Code2,
      color: 'from-purple-500 to-pink-600',
      badge: 'DSA Challenges'
    },
    {
      title: 'MCQs Attempted',
      value: stats?.mcqsCompleted || 0,
      icon: HelpCircle,
      color: 'from-amber-500 to-orange-600',
      badge: 'Subject Quizzes'
    },
    {
      title: 'Active Streak',
      value: `${stats?.streakDays || 1} Days`,
      icon: Flame,
      color: 'from-rose-500 to-red-600',
      badge: 'Daily Progress'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-blue-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Interview Preparation Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome Back, <span className="gradient-text">{user?.name}</span>!
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Track your performance metrics, tackle recommended topics, and take mock interviews to level up your engineering career.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
          <Link
            to="/interview/setup"
            className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Video className="w-4 h-4" />
            <span>New Mock Interview</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                  {card.badge}
                </span>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">{card.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{card.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Evolution Line Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Interview Score Evolution
              </h3>
              <p className="text-xs text-slate-400">Score performance across recent mock attempts</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.performanceChartData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} name="Overall Score" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="technical" stroke="#a855f7" strokeWidth={2} name="Technical Score" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="communication" stroke="#10b981" strokeWidth={2} name="Communication" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic-Wise Performance Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Topic Mastery Breakdown
              </h3>
              <p className="text-xs text-slate-400">Average score percentage by interview subject</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.topicPerformanceData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="topic" stroke="#64748b" fontSize={11} interval={0} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Mastery %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights Grid: Strengths, Weaknesses, Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Identified Strengths</h3>
          </div>
          <div className="space-y-2">
            {stats?.strengths?.map((str, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-200 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Areas for Improvement</h3>
          </div>
          <div className="space-y-2">
            {stats?.weaknesses?.map((weak, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-200 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                <span>{weak}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Topics */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Recommended Topics</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats?.recommendedTopics?.map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-blue-950/40 border border-blue-800/50 text-blue-300 text-xs font-semibold"
              >
                {topic}
              </span>
            ))}
          </div>
          <div className="pt-2">
            <Link
              to="/mcq"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Practice MCQs on these topics</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Attempts Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Interview Attempts</h3>
            <p className="text-xs text-slate-400">View detailed AI evaluations of your previous mock rounds</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {stats?.recentAttempts && stats.recentAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400 border-b border-slate-800 bg-slate-900/50">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Questions</th>
                  <th className="py-3 px-4">Overall Score</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recentAttempts.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-slate-300">
                      {new Date(inv.completedAt || inv.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">{inv.type}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        inv.difficulty === 'Easy' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' :
                        inv.difficulty === 'Hard' ? 'bg-rose-950/40 border-rose-800 text-rose-300' :
                        'bg-amber-950/40 border-amber-800 text-amber-300'
                      }`}>
                        {inv.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 text-xs">{inv.questions?.length || 0} Questions</td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-blue-400">{inv.score || 0}%</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/interview/${inv._id}/evaluation`}
                        className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-all inline-flex items-center gap-1"
                      >
                        View Scorecard
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm text-slate-400">No mock interviews completed yet.</p>
            <Link
              to="/interview/setup"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              Start First Interview
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
