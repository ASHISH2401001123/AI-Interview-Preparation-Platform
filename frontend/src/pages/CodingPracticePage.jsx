import React, { useState, useEffect } from 'react';
import { codingAPI } from '../services/api';
import { 
  Code2, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  FileCode, 
  Terminal, 
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function CodingPracticePage() {
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await codingAPI.getAll();
      setProblems(res.data);
      if (res.data.length > 0) {
        selectProblem(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching coding problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectProblem = (prob) => {
    setActiveProblem(prob);
    setExecutionResult(null);
    const starter = prob.starterCode?.[language] || getDefaultStarterCode(prob.title, language);
    setCode(starter);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (activeProblem?.starterCode?.[newLang]) {
      setCode(activeProblem.starterCode[newLang]);
    } else {
      setCode(getDefaultStarterCode(activeProblem?.title || '', newLang));
    }
  };

  const getDefaultStarterCode = (title, lang) => {
    const fnName = title.replace(/\s+/g, '');
    if (lang === 'python') return `def ${fnName.toLowerCase()}(input_data):\n    # Write your solution here\n    pass`;
    if (lang === 'java') return `class Solution {\n    public Object solve(Object input) {\n        // Write your solution here\n        return null;\n    }\n}`;
    return `function ${fnName.toLowerCase()}(input) {\n  // Write your solution here\n  return true;\n}`;
  };

  const handleRunOrSubmit = async (isSubmission = false) => {
    if (!activeProblem) return;
    try {
      setRunning(true);
      setExecutionResult(null);
      const res = await codingAPI.submitCode({
        questionId: activeProblem._id,
        code,
        language
      });
      setExecutionResult(res.data);
    } catch (err) {
      setExecutionResult({
        score: 0,
        passed: false,
        message: err.response?.data?.message || 'Code execution error'
      });
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading Coding Workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Problem Selector Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{activeProblem?.title || 'Coding Practice'}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                activeProblem?.difficulty === 'Easy' ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' :
                activeProblem?.difficulty === 'Hard' ? 'bg-rose-950/60 border-rose-800 text-rose-300' :
                'bg-amber-950/60 border-amber-800 text-amber-300'
              }`}>
                {activeProblem?.difficulty}
              </span>
            </h1>
            <p className="text-xs text-slate-400">{activeProblem?.category}</p>
          </div>
        </div>

        {/* Problem Selector Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={activeProblem?._id || ''}
            onChange={(e) => {
              const found = problems.find(p => p._id === e.target.value);
              if (found) selectProblem(found);
            }}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            {problems.map(p => (
              <option key={p._id} value={p._id}>
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Screen Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Problem Description Panel */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 overflow-y-auto max-h-[700px]">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Problem Description
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {activeProblem?.description}
            </p>
          </div>

          {/* Examples */}
          {activeProblem?.examples && activeProblem.examples.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Examples</h4>
              {activeProblem.examples.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500">Input: </span>
                    <span className="text-purple-300">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Output: </span>
                    <span className="text-emerald-300">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="text-[11px] text-slate-400 font-sans pt-1 border-t border-slate-800">
                      <strong>Explanation:</strong> {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Constraints */}
          {activeProblem?.constraints && activeProblem.constraints.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Constraints</h4>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 font-mono">
                {activeProblem.constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Code Editor & Sandbox */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Code Editor</span>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {['javascript', 'python', 'java'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                      language === lang
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'javascript' ? 'JS' : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Input */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#090d16]">
              <textarea
                rows={14}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-transparent p-4 text-xs font-mono text-emerald-400 placeholder-slate-600 focus:outline-none leading-relaxed resize-none"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-slate-500" />
              <span>Execution Engine Ready</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRunOrSubmit(false)}
                disabled={running}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 disabled:opacity-50"
              >
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-emerald-400" />}
                <span>Run Code</span>
              </button>

              <button
                onClick={() => handleRunOrSubmit(true)}
                disabled={running}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50"
              >
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-white" />}
                <span>Submit Code</span>
              </button>
            </div>
          </div>

          {/* Execution Result Box */}
          {executionResult && (
            <div className={`p-4 rounded-2xl border text-xs space-y-3 ${
              executionResult.passed
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider flex items-center gap-2">
                  {executionResult.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                  <span>{executionResult.message}</span>
                </span>
                <span className="font-extrabold text-sm">
                  Score: {executionResult.score}% ({executionResult.passedCount}/{executionResult.totalCount} Passed)
                </span>
              </div>

              {/* Test Cases Output List */}
              <div className="space-y-1.5 font-mono text-[11px] pt-1">
                {executionResult.testResults?.map((tr, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span>Test Case #{tr.testCaseIndex}: Input ({tr.input})</span>
                    <span className={tr.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {tr.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
