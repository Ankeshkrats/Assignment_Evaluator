"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-[#F4F7FE] overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 🌟 GLASSMORPHISM NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <span className="text-2xl font-black text-[#1B254B] tracking-tight">
                AIEval<span className="text-violet-600">.</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-bold text-[#A3AED0] hover:text-[#1B254B] transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-bold text-[#A3AED0] hover:text-[#1B254B] transition-colors">Workflow</a>
              <div className="flex items-center gap-4 ml-2 border-l border-slate-200 pl-6">
                <Link href="/auth?role=student" className="text-sm font-bold text-[#1B254B] hover:text-indigo-600 transition-colors">
                  Student Login
                </Link>
                <Link href="/auth?role=teacher" className="bg-[#1B254B] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-[#1B254B]/20">
                  Professor Portal →
                </Link>
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              className="md:hidden p-2 text-[#1B254B] focus:outline-none" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </div>

        {/* 📱 MOBILE DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-2xl flex flex-col p-6 gap-4 z-40 animate-fade-in-up">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-[#1B254B] p-2 hover:bg-slate-50 rounded-lg">Features</a>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-[#1B254B] p-2 hover:bg-slate-50 rounded-lg">How It Works</a>
            <div className="border-t border-slate-100 pt-4 mt-2 flex flex-col gap-3">
              <Link href="/auth?role=student" className="w-full text-center bg-[#F4F7FE] text-[#1B254B] px-6 py-3.5 rounded-xl text-sm font-bold transition-all">
                Student Login
              </Link>
              <Link href="/auth?role=teacher" className="w-full text-center bg-[#1B254B] text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-lg">
                Professor Portal
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 🚀 HERO SECTION */}
      <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden flex items-center justify-center">
        {/* Floating Glowing Background Orbs */}
        <div className="absolute top-10 left-[-10%] w-72 h-72 md:w-96 md:h-96 bg-violet-400/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-[-10%] w-72 h-72 md:w-96 md:h-96 bg-indigo-400/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center z-10 relative">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-violet-200 text-violet-700 text-xs md:text-sm font-bold px-4 py-2 rounded-full mb-8 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
            </span>
            Next-Gen AI Evaluator System
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#1B254B] leading-[1.1] tracking-tight mb-6">
            Grade smarter,<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">not harder.</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-[#A3AED0] font-medium max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            Upload any student PDF. Get instant AI-powered scores, keyphrase matching, and detailed RAG-contextual feedback in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 sm:px-0 mb-12">
            <Link href="/auth?role=teacher" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1B254B] text-white px-8 py-4 rounded-2xl text-base font-black hover:bg-indigo-600 transition-all shadow-xl shadow-[#1B254B]/20">
              Try as Professor 🎓
            </Link>
            <Link href="/auth?role=student" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#1B254B] border-2 border-slate-200 px-8 py-4 rounded-2xl text-base font-black hover:border-slate-300 hover:bg-slate-50 transition-all">
              Student Workspace →
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 opacity-80">
            {['⚡ Results in <30s', '🛡️ Strict Isolation', '📄 RAG Supported'].map((text) => (
              <div key={text} className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-2 text-[10px] sm:text-xs md:text-sm font-bold text-[#1B254B]">
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📊 LIVE RESULT PREVIEW (Responsive Grid) */}
      <section className="max-w-5xl mx-auto px-6 pb-20 md:pb-32">
        <div className="bg-[#0B1437] rounded-[32px] p-6 sm:p-10 grid md:grid-cols-2 gap-8 md:gap-12 shadow-2xl relative overflow-hidden border border-white/5">
          {/* Subtle grid pattern inside */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10">
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
              Live AI Evaluation
            </p>
            <div className="flex items-center gap-5 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="w-16 h-16 rounded-full border-4 border-violet-500 bg-[#1B254B] flex flex-col items-center justify-center shrink-0">
                <span className="text-2xl font-black text-white">9</span>
                <span className="text-[10px] text-violet-300 font-bold -mt-1">/10</span>
              </div>
              <div>
                <p className="text-white font-black text-xl mb-1">Excellent Work</p>
                <p className="text-violet-300 text-sm font-medium">Data Structures • 3rd Semester</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Concept Accuracy', score: 4, max: 4, pct: 100, color: 'bg-green-400' },
                { name: 'Keyphrase Match', score: 2, max: 3, pct: 66, color: 'bg-amber-400' },
                { name: 'Language & Structure', score: 3, max: 3, pct: 100, color: 'bg-green-400' },
              ].map(p => (
                <div key={p.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-slate-300 font-bold">{p.name}</span>
                    <span className="text-xs text-white font-bold bg-white/10 px-2 py-0.5 rounded">{p.score}/{p.max}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`${p.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
            <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">AI Identified Strengths</p>
            <div className="space-y-3 mb-8">
              {['Perfect explanation of Binary Trees.', 'Clean time complexity analysis.'].map(s => (
                <div key={s} className="flex items-start gap-3 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3">
                  <span className="text-green-400 text-sm shrink-0">✔</span>
                  <span className="text-green-50 text-sm font-medium leading-tight">{s}</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">Improvement Areas</p>
            <div className="flex items-start gap-3 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3">
              <span className="text-amber-400 text-sm shrink-0">🔧</span>
              <span className="text-amber-50 text-sm font-medium leading-tight">Include more examples of graph traversals.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 FEATURES SECTION */}
      <section id="features" className="bg-white border-y border-slate-100 py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Enterprise Features</p>
            <h2 className="text-3xl md:text-5xl font-black text-[#1B254B] tracking-tight mb-4">Built for scale & security</h2>
            <p className="text-base md:text-lg text-[#A3AED0] font-medium max-w-2xl mx-auto">A complete architecture designed to prevent cheating, organize data, and provide blazing fast AI results.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🧠', bg: 'bg-violet-50', border: 'hover:border-violet-300', title: 'Groq AI Core', desc: 'Deep semantic analysis utilizing Llama 3 models for instant, human-level grading accuracy.' },
              { icon: '🔒', bg: 'bg-indigo-50', border: 'hover:border-indigo-300', title: 'Anti-Cheat Lock', desc: 'Student identities, registration numbers, and branches are strictly locked to prevent manipulation.' },
              { icon: '🗄️', bg: 'bg-teal-50', border: 'hover:border-teal-300', title: 'Multi-Tenant Vault', desc: 'Professors get completely isolated workspaces to manage, filter, and export PDF reports.' },
              { icon: '📄', bg: 'bg-amber-50', border: 'hover:border-amber-300', title: 'RAG Architecture', desc: 'Upload model answer keys and question papers for context-aware, highly precise AI evaluation.' },
            ].map(f => (
              <div key={f.title} className={`bg-white border border-slate-100 rounded-[24px] p-6 md:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-slate-200/50 ${f.border}`}>
                <div className={`w-12 h-12 md:w-14 md:h-14 ${f.bg} rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-5 shadow-sm`}>{f.icon}</div>
                <h3 className="font-black text-[#1B254B] text-lg mb-3">{f.title}</h3>
                <p className="text-[#A3AED0] font-medium text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🛠️ HOW IT WORKS */}
      <section id="how-it-works" className="py-20 md:py-32 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Workflow</p>
          <h2 className="text-3xl md:text-5xl font-black text-[#1B254B] tracking-tight">Up and running in 3 steps</h2>
        </div>
        
        <div className="flex flex-col gap-6 md:gap-8">
          {[
            { n: 1, icon: '👨‍🏫', title: 'Professor initiates a session', desc: 'The teacher creates a new evaluation session, sets the target branch/semester, uploads an optional Answer Key, and shares the generated 8-digit code.' },
            { n: 2, icon: '📤', title: 'Student submits assignment', desc: 'Students log in, enter the 8-digit session code, and upload their assignment PDF. Their identity details are automatically attached.' },
            { n: 3, icon: '⚡', title: 'AI evaluates & stores data', desc: 'Groq AI instantly grades the submission. The result is shown to the student and permanently logged into the Professor\'s secure Vault.' },
          ].map(s => (
            <div key={s.n} className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 bg-white border border-slate-100 rounded-[24px] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#F4F7FE] text-indigo-600 font-black text-lg md:text-xl flex items-center justify-center shrink-0 border border-indigo-100">{s.n}</div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-black text-[#1B254B] mb-2">{s.title}</h3>
                <p className="text-[#A3AED0] font-medium text-sm md:text-base leading-relaxed">{s.desc}</p>
              </div>
              <span className="hidden sm:block text-3xl md:text-4xl bg-slate-50 p-4 rounded-2xl">{s.icon}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 💼 ROLE CARDS */}
      <section className="max-w-6xl mx-auto px-6 pb-20 md:pb-32">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Teacher Card */}
          <div className="bg-[#0B1437] rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-indigo-500/20"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-white/10">👨‍🏫</div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4">For Professors</h3>
              <p className="text-indigo-200 text-sm md:text-base leading-relaxed font-medium mb-8 max-w-sm">Create isolated sessions, upload RAG answer keys, view your secure result vault, and export perfectly formatted PDF reports.</p>
              <Link href="/auth?role=teacher" className="inline-flex items-center gap-2 bg-indigo-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm md:text-base hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/30">
                Access Workspace →
              </Link>
            </div>
          </div>
          
          {/* Student Card */}
          <div className="bg-white border-2 border-slate-100 rounded-[32px] p-8 md:p-12 relative overflow-hidden group hover:border-violet-200 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100/50 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-violet-200/50"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-violet-100">🎓</div>
              <h3 className="text-2xl md:text-3xl font-black text-[#1B254B] mb-4">For Students</h3>
              <p className="text-[#A3AED0] text-sm md:text-base leading-relaxed font-medium mb-8 max-w-sm">Log in with your college credentials, submit assignments securely, and get instant, detailed feedback to improve your grades.</p>
              <Link href="/auth?role=student" className="inline-flex items-center gap-2 bg-[#F4F7FE] text-violet-700 px-6 py-3.5 rounded-xl font-bold text-sm md:text-base hover:bg-violet-100 hover:text-violet-800 transition-all">
                Student Portal →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🏁 FOOTER */}
      <footer className="bg-white border-t border-slate-200 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1B254B] rounded-lg flex items-center justify-center text-sm shadow-md">🧠</div>
            <span className="text-[#1B254B] font-black text-lg">AIEval<span className="text-violet-600">.</span></span>
          </div>
          
          <div className="text-center md:text-left flex flex-col gap-1">
            <span className="text-[#1B254B] text-xs md:text-sm font-bold tracking-wide">Computer Science & Engineering (AI) • Final Year Project</span>
            <span className="text-slate-400 text-xs md:text-sm font-medium">Purnea College of Engineering © {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex gap-6">
            <Link href="/auth?role=student" className="text-slate-400 text-sm font-bold hover:text-indigo-600 transition-colors">Student Area</Link>
            <Link href="/auth?role=teacher" className="text-slate-400 text-sm font-bold hover:text-indigo-600 transition-colors">Professor Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}