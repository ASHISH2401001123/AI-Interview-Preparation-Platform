import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { 
  Video, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  HelpCircle, 
  Loader2, 
  ArrowRight,
  Code,
  Users,
  Layers
} from 'lucide-react';

export default function InterviewSetupPage() {
  const navigate = useNavigate();

  const [type, setType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedTopics, setSelectedTopics] = useState(['JavaScript', 'Data Structures']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const technicalTopics = [
    'Java',
    'Python',
    'JavaScript',
    'Data Structures',
    'Algorithms',
    'DBMS',
    'Operating Systems',
    'Computer Networks',
    'OOP'
  ];

  const hrTopics = [
    'Tell me about yourself',
    'Strengths and weaknesses',
    'Leadership',
    'Teamwork',
    'Conflict management',
    'Career goals',
    'Situational questions'
  ];

  const availableTopics = type === 'HR' ? hrTopics : technicalTopics;

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter(t => t !== topic));
      }
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await interviewAPI.create({
        type,
        difficulty,
        questionCount,
        topics: selectedTopics
      });
      const newInterviewId = res.data._id;
      navigate(`/interview/${newInterviewId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
          <Video className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Configure Mock Interview</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Customize your interview domain, difficulty level, and topics to match your upcoming real-world company rounds.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-8 shadow-2xl">
        {/* Step 1: Select Interview Type */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            1. Select Interview Type
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => {
                setType('Technical');
                setSelectedTopics(['JavaScript', 'Data Structures']);
              }}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                type === 'Technical'
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Code className="w-6 h-6 text-blue-400" />
                {type === 'Technical' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Technical Round</h4>
                <p className="text-xs text-slate-400 mt-1">CS Core, System Design & Code Theory</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('HR');
                setSelectedTopics(['Tell me about yourself', 'Strengths and weaknesses']);
              }}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                type === 'HR'
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Users className="w-6 h-6 text-purple-400" />
                {type === 'HR' && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
              </div>
              <div>
                <h4 className="font-bold text-base text-white">HR & Behavioral</h4>
                <p className="text-xs text-slate-400 mt-1">STAR Method, Conflict & Situational</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('Mixed');
                setSelectedTopics(['JavaScript', 'Data Structures', 'Tell me about yourself']);
              }}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                type === 'Mixed'
                  ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                {type === 'Mixed' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Mixed Round</h4>
                <p className="text-xs text-slate-400 mt-1">Balanced Technical + HR Questions</p>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Select Difficulty */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            2. Select Difficulty Level
          </label>

          <div className="grid grid-cols-3 gap-3">
            {['Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                  difficulty === diff
                    ? diff === 'Easy' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' :
                      diff === 'Hard' ? 'bg-rose-950/60 border-rose-500 text-rose-300' :
                      'bg-amber-950/60 border-amber-500 text-amber-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Question Count */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            3. Number of Questions
          </label>

          <div className="grid grid-cols-3 gap-3">
            {[3, 5, 10].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                  questionCount === count
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {count} Questions (~{count * 3} mins)
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Choose Topics */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            4. Select Specific Topics ({selectedTopics.length} selected)
          </label>

          <div className="flex flex-wrap gap-2.5">
            {availableTopics.map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action CTA */}
        <div className="pt-4">
          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Initializing AI Interview Environment...</span>
              </>
            ) : (
              <>
                <span>Launch Mock Interview</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
