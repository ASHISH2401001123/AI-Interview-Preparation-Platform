import React, { useState, useEffect } from 'react';
import { mcqAPI } from '../services/api';
import { 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Loader2, 
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

export default function McqPracticePage() {
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: selectedOptionIndex }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes test

  useEffect(() => {
    fetchMCQs();
  }, [category, difficulty]);

  // Quiz timer
  useEffect(() => {
    if (results || questions.length === 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [results, questions]);

  const fetchMCQs = async () => {
    try {
      setLoading(true);
      setResults(null);
      setSelectedAnswers({});
      setCurrentIndex(0);
      setTimerSeconds(600);
      const res = await mcqAPI.getMCQs({ category, difficulty, limit: 10 });
      setQuestions(res.data);
    } catch (err) {
      console.error('Error fetching MCQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optionIdx) => {
    if (results) return; // locked after submission
    setSelectedAnswers({
      ...selectedAnswers,
      [qId]: optionIdx
    });
  };

  const handleSubmitQuiz = async () => {
    if (questions.length === 0) return;
    try {
      setSubmitting(true);
      const payload = questions.map((q) => ({
        questionId: q._id,
        selectedIndex: selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : -1
      }));

      const res = await mcqAPI.submitMCQ({
        answers: payload,
        category: category === 'All' ? 'General CS' : category
      });
      setResults(res.data);
    } catch (err) {
      console.error('Error submitting MCQ test:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-amber-400" />
            <span>Technical MCQ Practice</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Test your core computer science concept knowledge with timed multiple-choice quizzes.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 font-semibold"
          >
            <option value="All">All Topics</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Data Structures">Data Structures</option>
            <option value="Algorithms">Algorithms</option>
            <option value="DBMS">DBMS</option>
            <option value="Operating Systems">Operating Systems</option>
            <option value="Computer Networks">Computer Networks</option>
            <option value="OOP">OOP</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 font-semibold"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button
            onClick={fetchMCQs}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            title="Reset Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading Quiz Questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">No MCQs Found</h3>
          <p className="text-slate-400 text-sm">Try choosing a different topic or difficulty level.</p>
        </div>
      ) : results ? (
        /* Results View */
        <div className="space-y-6">
          {/* Summary Score Banner */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-amber-950/40 to-slate-900/90 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center mx-auto text-white shadow-xl">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Quiz Completed!</h2>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-amber-400">{results.score}%</div>
                <div className="text-xs text-slate-400">Score Percentage</div>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="text-center">
                <div className="text-3xl font-extrabold text-emerald-400">{results.correctCount} / {results.totalCount}</div>
                <div className="text-xs text-slate-400">Correct Answers</div>
              </div>
            </div>
            <button
              onClick={fetchMCQs}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all"
            >
              Try Another Quiz
            </button>
          </div>

          {/* Results Answer Key Breakdown */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              Detailed Explanations & Answer Key
            </h3>

            <div className="space-y-4">
              {results.results?.map((res, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border text-sm space-y-3 ${
                    res.isCorrect ? 'bg-emerald-950/20 border-emerald-800/60' : 'bg-rose-950/20 border-rose-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span>Q{idx + 1}.</span> {res.title}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      res.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {res.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {res.options?.map((opt, oIdx) => {
                      const isUserChoice = Number(res.selectedIndex) === oIdx;
                      const isCorrectChoice = Number(res.correctIndex) === oIdx;
                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            isCorrectChoice
                              ? 'bg-emerald-900/40 border-emerald-500 text-emerald-200 font-semibold'
                              : isUserChoice
                              ? 'bg-rose-900/40 border-rose-500 text-rose-200'
                              : 'bg-slate-900/80 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                          {isCorrectChoice && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {!isCorrectChoice && isUserChoice && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {res.explanation && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      <strong>Explanation:</strong> {res.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Interface */
        <div className="space-y-6">
          {/* Progress Bar & Timer */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] uppercase font-bold">
                {currentQ?.category}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
          </div>

          {/* Active Question Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentIndex + 1}. {currentQ?.title}
            </h3>

            {/* Options List */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ?.options?.map((option, idx) => {
                const isSelected = selectedAnswers[currentQ._id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ._id, idx)}
                    className={`p-4 rounded-2xl border text-left font-medium text-sm transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center border ${
                        isSelected ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation & Submit Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Evaluating Results...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Quiz</span>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
