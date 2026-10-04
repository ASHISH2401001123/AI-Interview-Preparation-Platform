import React, { useState, useEffect } from 'react';
import { questionAPI, codingAPI, userAPI } from '../services/api';
import { 
  ShieldAlert, 
  Users, 
  HelpCircle, 
  Code2, 
  Video, 
  Plus, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  X,
  BookOpen
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('mcq'); // 'mcq', 'coding', 'users'

  const [users, setUsers] = useState([]);
  const [mcqs, setMcqs] = useState([]);
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // New MCQ Modal State
  const [showMcqModal, setShowMcqModal] = useState(false);
  const [newMcq, setNewMcq] = useState({
    title: '',
    category: 'Java',
    difficulty: 'Medium',
    type: 'mcq',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  // New Coding Modal State
  const [showCodingModal, setShowCodingModal] = useState(false);
  const [newCoding, setNewCoding] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    category: 'DSA',
    inputExample: '',
    outputExample: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [uRes, qRes, cRes] = await Promise.all([
        userAPI.getAllUsers(),
        questionAPI.getAll(),
        codingAPI.getAll()
      ]);
      setUsers(uRes.data);
      setMcqs(qRes.data);
      setCodingQuestions(cRes.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMcq = async (e) => {
    e.preventDefault();
    try {
      await questionAPI.create(newMcq);
      setShowMcqModal(false);
      setNewMcq({
        title: '',
        category: 'Java',
        difficulty: 'Medium',
        type: 'mcq',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      });
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding MCQ');
    }
  };

  const handleDeleteMcq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await questionAPI.delete(id);
      fetchAdminData();
    } catch (err) {
      alert('Error deleting question');
    }
  };

  const handleCreateCoding = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newCoding.title,
        description: newCoding.description,
        difficulty: newCoding.difficulty,
        category: newCoding.category,
        examples: [
          { input: newCoding.inputExample, output: newCoding.outputExample }
        ],
        testCases: [
          { input: newCoding.inputExample, expectedOutput: newCoding.outputExample }
        ]
      };
      await codingAPI.create(payload);
      setShowCodingModal(false);
      setNewCoding({ title: '', description: '', difficulty: 'Medium', category: 'DSA', inputExample: '', outputExample: '' });
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding coding question');
    }
  };

  const handleDeleteCoding = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coding question?')) return;
    try {
      await codingAPI.delete(id);
      fetchAdminData();
    } catch (err) {
      alert('Error deleting coding question');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading Administrator Control Panel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-800/40 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Platform Admin Control Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">System Administration</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMcqModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add MCQ Question</span>
          </button>

          <button
            onClick={() => setShowCodingModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Coding Problem</span>
          </button>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <Users className="w-5 h-5 text-blue-400" />
          <div className="text-2xl font-extrabold text-white">{users.length}</div>
          <div className="text-xs text-slate-400">Total Registered Users</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <div className="text-2xl font-extrabold text-white">{mcqs.length}</div>
          <div className="text-xs text-slate-400">MCQs in Database</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <Code2 className="w-5 h-5 text-purple-400" />
          <div className="text-2xl font-extrabold text-white">{codingQuestions.length}</div>
          <div className="text-xs text-slate-400">Coding Questions</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <Video className="w-5 h-5 text-emerald-400" />
          <div className="text-2xl font-extrabold text-white">Active</div>
          <div className="text-xs text-slate-400">Platform Status</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('mcq')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'mcq' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Manage MCQs & Interview Questions ({mcqs.length})
        </button>
        <button
          onClick={() => setActiveTab('coding')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'coding' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Manage Coding Problems ({codingQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'users' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Registered Users ({users.length})
        </button>
      </div>

      {/* Tab 1: MCQs */}
      {activeTab === 'mcq' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400 border-b border-slate-800 bg-slate-900">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {mcqs.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-white max-w-xs truncate">{q.title}</td>
                    <td className="py-3 px-4 text-xs text-slate-300">{q.category}</td>
                    <td className="py-3 px-4 text-xs font-bold uppercase text-blue-400">{q.type}</td>
                    <td className="py-3 px-4 text-xs text-slate-300">{q.difficulty}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteMcq(q._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Coding Problems */}
      {activeTab === 'coding' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400 border-b border-slate-800 bg-slate-900">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {codingQuestions.map((cq) => (
                  <tr key={cq._id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-white">{cq.title}</td>
                    <td className="py-3 px-4 text-xs text-slate-300">{cq.category}</td>
                    <td className="py-3 px-4 text-xs text-slate-300">{cq.difficulty}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteCoding(cq._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40"
                        title="Delete Coding Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Registered Users */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400 border-b border-slate-800 bg-slate-900">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Interviews Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-white">{u.name}</td>
                    <td className="py-3 px-4 text-xs text-slate-300">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-950 text-purple-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-bold text-blue-400">{u.interviewCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add MCQ Modal */}
      {showMcqModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 rounded-3xl border border-slate-800 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create New Question</h3>
              <button onClick={() => setShowMcqModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMcq} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Question Title</label>
                <input
                  type="text"
                  value={newMcq.title}
                  onChange={(e) => setNewMcq({ ...newMcq, title: e.target.value })}
                  placeholder="Enter question text"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category</label>
                  <input
                    type="text"
                    value={newMcq.category}
                    onChange={(e) => setNewMcq({ ...newMcq, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Type</label>
                  <select
                    value={newMcq.type}
                    onChange={(e) => setNewMcq({ ...newMcq, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="technical">Technical Interview</option>
                    <option value="hr">HR Interview</option>
                  </select>
                </div>
              </div>

              {newMcq.type === 'mcq' && (
                <div className="space-y-2">
                  <label className="text-slate-300 font-bold block">4 MCQ Options</label>
                  {newMcq.options.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newMcq.options];
                        updated[idx] = e.target.value;
                        setNewMcq({ ...newMcq, options: updated });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  ))}
                  <div>
                    <label className="text-slate-300 font-bold block mt-2 mb-1">Correct Answer Index (0 = A, 1 = B...)</label>
                    <input
                      type="number"
                      min={0}
                      max={3}
                      value={newMcq.correctAnswer}
                      onChange={(e) => setNewMcq({ ...newMcq, correctAnswer: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-slate-300 font-bold block mb-1">Explanation</label>
                <textarea
                  value={newMcq.explanation}
                  onChange={(e) => setNewMcq({ ...newMcq, explanation: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm"
              >
                Save Question
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Coding Modal */}
      {showCodingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 rounded-3xl border border-slate-800 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create Coding Problem</h3>
              <button onClick={() => setShowCodingModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoding} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Problem Title</label>
                <input
                  type="text"
                  value={newCoding.title}
                  onChange={(e) => setNewCoding({ ...newCoding, title: e.target.value })}
                  placeholder="e.g. Reverse LinkedList"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  value={newCoding.description}
                  onChange={(e) => setNewCoding({ ...newCoding, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category</label>
                  <input
                    type="text"
                    value={newCoding.category}
                    onChange={(e) => setNewCoding({ ...newCoding, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Difficulty</label>
                  <select
                    value={newCoding.difficulty}
                    onChange={(e) => setNewCoding({ ...newCoding, difficulty: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Sample Input</label>
                  <input
                    type="text"
                    value={newCoding.inputExample}
                    onChange={(e) => setNewCoding({ ...newCoding, inputExample: e.target.value })}
                    placeholder="e.g. [2,7,11,15], 9"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Sample Output</label>
                  <input
                    type="text"
                    value={newCoding.outputExample}
                    onChange={(e) => setNewCoding({ ...newCoding, outputExample: e.target.value })}
                    placeholder="e.g. [0,1]"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-sm"
              >
                Save Coding Problem
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
