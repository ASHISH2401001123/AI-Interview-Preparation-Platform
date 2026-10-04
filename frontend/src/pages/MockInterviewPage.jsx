import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { 
  Bot, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  Send,
  Flag
} from 'lucide-react';

export default function MockInterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState('');

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Audio Speech Synthesis & Recognition state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await interviewAPI.getById(id);
        setInterview(res.data);

        // Check if answers already exist for index
        if (res.data.answers && res.data.answers.length > 0) {
          const nextUnanswered = res.data.answers.length;
          if (nextUnanswered < res.data.questions.length) {
            setCurrentIndex(nextUnanswered);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load interview session');
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  // Elapsed Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set answerText when changing question index
  useEffect(() => {
    if (interview?.answers) {
      const existing = interview.answers.find(a => a.questionIndex === currentIndex);
      setAnswerText(existing ? existing.answer : '');
    }
  }, [currentIndex, interview]);

  // Text-To-Speech function
  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech-To-Text Dictation setup
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please type your answer.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswerText((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const currentQuestion = interview?.questions?.[currentIndex];
  const totalQuestions = interview?.questions?.length || 0;

  const handleNextOrSubmit = async () => {
    if (!answerText.trim()) {
      alert('Please provide an answer before moving to the next question.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await interviewAPI.submitAnswer(id, {
        questionIndex: currentIndex,
        answer: answerText
      });

      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
        setAnswerText('');
      } else {
        // Last question answered -> Finish interview
        handleFinishInterview();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishInterview = async () => {
    try {
      setFinishing(true);
      await interviewAPI.complete(id);
      navigate(`/interview/${id}/evaluation`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error completing interview session');
      setFinishing(false);
    }
  };

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Preparing AI Interview Environment...</p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Interview Unavailable</h2>
        <p className="text-slate-400 text-sm">{error || 'Session not found'}</p>
        <button
          onClick={() => navigate('/interview/setup')}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm"
        >
          Return to Setup
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Session Status Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-wider">
            {interview.type} Round
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Difficulty: <strong className="text-slate-200">{interview.difficulty}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <button
            onClick={handleFinishInterview}
            disabled={finishing}
            className="px-3.5 py-1.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 hover:bg-rose-900/60 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>End Interview</span>
          </button>
        </div>
      </div>

      {/* Main Interview Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left AI Interviewer Card */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* AI Avatar */}
            <div className="relative w-28 h-28 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl animate-pulse blur-xl opacity-40" />
              <div className="w-full h-full rounded-3xl bg-slate-900 border-2 border-blue-500/50 flex items-center justify-center relative z-10 shadow-2xl">
                <Bot className="w-14 h-14 text-blue-400" />
              </div>
              {isSpeaking && (
                <span className="absolute -bottom-2 right-0 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] animate-bounce z-20">
                  Speaking
                </span>
              )}
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg text-white">AI Technical Interviewer</h3>
              <p className="text-xs text-slate-400">Evaluating conceptual clarity & delivery</p>
            </div>

            {/* Question Text Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Question {currentIndex + 1} of {totalQuestions}</span>
                <span className="text-purple-400">{currentQuestion?.category}</span>
              </div>

              <h4 className="text-base font-semibold text-white leading-relaxed">
                "{currentQuestion?.title}"
              </h4>

              {currentQuestion?.description && (
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {currentQuestion.description}
                </p>
              )}

              <button
                onClick={() => speakQuestion(currentQuestion?.title)}
                className={`mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSpeaking
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Stop Audio' : 'Listen Question'}</span>
              </button>
            </div>
          </div>

          {/* Question Index Progress Dots */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-center gap-1.5">
              {Array.from({ length: totalQuestions }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    idx === currentIndex
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400/50'
                      : idx < currentIndex
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Candidate Answer Input */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>Your Response</span>
                <span className="text-slate-500 text-[11px] font-normal">
                  ({answerText.trim() ? answerText.trim().split(/\s+/).length : 0} words)
                </span>
              </label>

              {/* Voice Dictation Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isListening
                    ? 'bg-red-950/80 border border-red-500 text-red-300 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-blue-400" />}
                <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
              </button>
            </div>

            <textarea
              rows={10}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type or speak your answer here. Provide clear explanations, trade-offs, code steps, or STAR method context..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed resize-none font-sans"
            />

            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs text-blue-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Tip:</strong> Provide structured points. For HR questions, use Situation - Task - Action - Result. For technical questions, mention complexity and edge cases.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={handleNextOrSubmit}
              disabled={submitting || finishing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Answer...</span>
                </>
              ) : currentIndex === totalQuestions - 1 ? (
                <>
                  <span>Complete & Submit Round</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Save & Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
