import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { 
  User, 
  Mail, 
  Shield, 
  Award, 
  Video, 
  Code2, 
  HelpCircle, 
  Plus, 
  X, 
  LogOut, 
  Loader2, 
  CheckCircle2 
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getProfile();
      setProfileData(res.data);
    } catch (err) {
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    const currentSkills = profileData?.user?.skills || user?.skills || [];
    if (currentSkills.includes(newSkill.trim())) {
      setNewSkill('');
      return;
    }

    const updatedSkills = [...currentSkills, newSkill.trim()];
    await saveSkills(updatedSkills);
    setNewSkill('');
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const currentSkills = profileData?.user?.skills || user?.skills || [];
    const updatedSkills = currentSkills.filter(s => s !== skillToRemove);
    await saveSkills(updatedSkills);
  };

  const saveSkills = async (updatedSkills) => {
    try {
      setUpdating(true);
      const res = await userAPI.updateProfile({ skills: updatedSkills });
      updateUser({ skills: updatedSkills });
      setProfileData((prev) => ({
        ...prev,
        user: { ...prev.user, skills: updatedSkills }
      }));
      setSuccessMsg('Skills updated!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error updating skills:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading User Profile...</p>
      </div>
    );
  }

  const userData = profileData?.user || user;
  const stats = profileData?.stats || { totalInterviews: 0, avgScore: 0, codingSolved: 0, mcqsAttempted: 0 };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Profile Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-extrabold text-white uppercase shadow-2xl shadow-blue-500/20 shrink-0">
          {userData?.name?.charAt(0) || 'U'}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-white">{userData?.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
              userData?.role === 'admin'
                ? 'bg-purple-950/60 border-purple-800 text-purple-300'
                : 'bg-blue-950/60 border-blue-800 text-blue-300'
            }`}>
              {userData?.role === 'admin' ? 'Administrator' : 'Student / Candidate'}
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400">
            <Mail className="w-3.5 h-3.5" />
            <span>{userData?.email}</span>
          </div>

          <p className="text-xs text-slate-500">
            Member since {new Date(userData?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-900/50 text-red-300 hover:bg-red-900/60 text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1">
          <Video className="w-5 h-5 text-blue-400 mx-auto" />
          <div className="text-2xl font-extrabold text-white">{stats.totalInterviews}</div>
          <div className="text-xs text-slate-400">Interviews Taken</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1">
          <Award className="w-5 h-5 text-emerald-400 mx-auto" />
          <div className="text-2xl font-extrabold text-white">{stats.avgScore}%</div>
          <div className="text-xs text-slate-400">Average Score</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1">
          <Code2 className="w-5 h-5 text-purple-400 mx-auto" />
          <div className="text-2xl font-extrabold text-white">{stats.codingSolved}</div>
          <div className="text-xs text-slate-400">Coding Problems</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1">
          <HelpCircle className="w-5 h-5 text-amber-400 mx-auto" />
          <div className="text-2xl font-extrabold text-white">{stats.mcqsAttempted}</div>
          <div className="text-xs text-slate-400">MCQs Solved</div>
        </div>
      </div>

      {/* Skills Management Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Technical & Soft Skills
            </h3>
            <p className="text-xs text-slate-400">Add key technologies to personalize your AI interview questions</p>
          </div>
          {successMsg && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              {successMsg}
            </span>
          )}
        </div>

        <form onSubmit={handleAddSkill} className="flex gap-3 max-w-md">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add new skill (e.g. React, Java, Docker)"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={updating}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {userData?.skills?.map((skill, idx) => (
            <span
              key={idx}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-semibold flex items-center gap-2 group hover:border-blue-500 transition-all"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-500 hover:text-red-400"
                title="Remove skill"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
