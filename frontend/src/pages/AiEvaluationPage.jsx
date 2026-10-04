import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Loader2,
  Sparkles,
  Zap,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip
} from 'recharts';

export default function AiEvaluationPage() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(0);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await interviewAPI.getById(id);
        setInterview(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch AI evaluation');
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Synthesizing Comprehensive AI Evaluation...</p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Evaluation Report Unavailable</h2>
        <p className="text-slate-400 text-sm">{error || 'Session not found'}</p>
        <Link to="/history" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm">
          View History
        </Link>
      </div>
    );
  }

  const radarData = [
    { subject: 'Overall', score: interview.score || 75 },
    { subject: 'Technical', score: interview.technicalScore || 75 },
    { subject: 'Communication', score: interview.communicationScore || 75 },
    { subject: 'Relevance', score: interview.relevanceScore || 75 },
    { subject: 'Confidence', score: interview.confidenceScore || 75 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-purple-950/40 to-blue-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI Scorecard Report
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {interview.type} Interview Evaluation
          </h1>
          <p className="text-xs text-slate-400">
            Completed on {new Date(interview.completedAt || interview.startedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Difficulty: {interview.difficulty}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/interview/setup"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Interview</span>
          </Link>
        </div>
      </div>

      {/* Score Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-blue-500/30 bg-blue-950/20 text-center space-y-1">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Overall Score</span>
          <div className="text-3xl font-extrabold text-white">{interview.score || 0}%</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 text-center space-y-1">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Technical</span>
          <div className="text-3xl font-extrabold text-white">{interview.technicalScore || 0}%</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-center space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Communication</span>
          <div className="text-3xl font-extrabold text-white">{interview.communicationScore || 0}%</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 text-center space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Relevance</span>
          <div className="text-3xl font-extrabold text-white">{interview.relevanceScore || 0}%</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-pink-500/30 bg-pink-950/20 text-center space-y-1">
          <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">Confidence</span>
          <div className="text-3xl font-extrabold text-white">{interview.confidenceScore || 0}%</div>
        </div>
      </div>

      {/* Breakdown Grid: Radar Chart + Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Visualizer */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Performance Radar
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#475569" fontSize={10} />
                <Radar name="Candidate" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '0.75rem' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Key Strengths
              </h4>
              <div className="space-y-2">
                {interview.strengths?.map((str, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                    {str}
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Areas to Improve
              </h4>
              <div className="space-y-2">
                {interview.weaknesses?.map((weak, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                    {weak}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              Actionable AI Coaching Tips
            </h4>
            <div className="space-y-2">
              {interview.suggestions?.map((sug, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs text-blue-200 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Per-Question Detailed Model Answer Breakdown */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Question-by-Question AI Analysis
        </h3>

        <div className="space-y-4">
          {interview.answers?.map((ans, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center">
                      Q{idx + 1}
                    </span>
                    <span className="font-semibold text-white text-sm line-clamp-1">
                      {ans.questionText}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-full border border-blue-800">
                      Score: {ans.score}%
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40 text-xs">
                    {/* User Answer */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Your Response</span>
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed font-sans">
                        {ans.answer || 'No response recorded.'}
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-purple-400 uppercase tracking-wider text-[10px]">AI Feedback & Evaluation</span>
                      <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/40 text-purple-200 leading-relaxed">
                        {ans.feedback || ans.evaluation}
                      </div>
                    </div>

                    {/* Model Answer */}
                    {ans.improvedAnswer && (
                      <div className="space-y-1.5">
                        <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Benchmark Exemplary Answer</span>
                        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-emerald-200 leading-relaxed font-mono whitespace-pre-wrap">
                          {ans.improvedAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
