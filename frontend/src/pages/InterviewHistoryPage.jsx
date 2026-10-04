import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { 
  History, 
  Calendar, 
  Award, 
  ChevronRight, 
  Loader2, 
  Filter, 
  Plus, 
  Video 
} from 'lucide-react';

export default function InterviewHistoryPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await interviewAPI.getAll();
        setInterviews(res.data);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredInterviews = interviews.filter((inv) => {
    if (filterType !== 'All' && inv.type !== filterType) return false;
    if (filterDiff !== 'All' && inv.difficulty !== filterDiff) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Fetching Session History...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <History className="w-8 h-8 text-blue-400" />
            <span>Interview Attempt History</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review past mock interview scores, detailed AI scorecards, and performance trends over time.
          </p>
        </div>

        <Link
          to="/interview/setup"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Mock Session</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase">
            <Filter className="w-4 h-4 text-blue-400" />
            <span>Filter By:</span>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Types</option>
            <option value="Technical">Technical</option>
            <option value="HR">HR & Behavioral</option>
            <option value="Mixed">Mixed Round</option>
          </select>

          <select
            value={filterDiff}
            onChange={(e) => setFilterDiff(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <span className="text-xs text-slate-400">
          Showing <strong>{filteredInterviews.length}</strong> sessions
        </span>
      </div>

      {/* Sessions Grid */}
      {filteredInterviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map((inv) => (
            <div
              key={inv._id}
              className="glass-panel p-6 rounded-3xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                    {inv.type} Round
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    inv.difficulty === 'Easy' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' :
                    inv.difficulty === 'Hard' ? 'bg-rose-950/40 border-rose-800 text-rose-300' :
                    'bg-amber-950/40 border-amber-800 text-amber-300'
                  }`}>
                    {inv.difficulty}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(inv.completedAt || inv.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-bold text-white text-base">
                    {inv.questions?.length || 0} Questions Attempted
                  </h3>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Overall AI Score</span>
                  <span className="text-xl font-extrabold text-blue-400">{inv.score || 0}%</span>
                </div>
              </div>

              <Link
                to={`/interview/${inv._id}/evaluation`}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span>View Full Scorecard</span>
                <ChevronRight className="w-4 h-4 text-blue-400" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Mock Interviews Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            You haven't completed any mock interviews matching the selected filters yet.
          </p>
          <Link
            to="/interview/setup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm"
          >
            Start First Interview
          </Link>
        </div>
      )}
    </div>
  );
}
