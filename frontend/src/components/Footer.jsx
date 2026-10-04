import React from 'react';
import { Sparkles, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#070a12] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Prep<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering students and job seekers with modern AI-driven mock interviews, interactive coding practice, and actionable career feedback.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Features</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/interview/setup" className="hover:text-blue-400 transition-colors">AI Mock Interviews</Link></li>
              <li><Link to="/mcq" className="hover:text-blue-400 transition-colors">Technical MCQs</Link></li>
              <li><Link to="/coding" className="hover:text-blue-400 transition-colors">Coding Sandbox</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Performance Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Interview Topics</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-400">Java & Python OOP</span></li>
              <li><span className="text-slate-400">Data Structures & Algorithms</span></li>
              <li><span className="text-slate-400">DBMS & SQL Queries</span></li>
              <li><span className="text-slate-400">Operating Systems & Networks</span></li>
              <li><span className="text-slate-400">Behavioral & HR Frameworks</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              AI Evaluation powered by Google Gemini API & fallback engine.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PrepAI Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for engineers and candidates.
          </div>
        </div>
      </div>
    </footer>
  );
}
