"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('New Submission');
  const [userProfile, setUserProfile] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [sessionId, setSessionId] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [myHistory, setMyHistory] = useState([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'student') {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('regNumber');
      localStorage.removeItem('branch');
      router.push('/auth');
    } else {
        setUserProfile({
            name: localStorage.getItem('userName') || 'Student',
            regNumber: localStorage.getItem('regNumber') || 'N/A',
            branch: localStorage.getItem('branch') || 'Computer Science & Engineering' 
        });
    }
  }, [router]);

  useEffect(() => {
    if (activeTab === 'My History' && userProfile) {
      const submissions = JSON.parse(localStorage.getItem('ai_eval_submissions')) || [];
      const mySubmissions = submissions.filter(s => s.roll === userProfile.regNumber);
      setMyHistory([...mySubmissions].reverse());
    }
  }, [activeTab, userProfile]);

  const handleLogout = () => { 
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('regNumber');
      localStorage.removeItem('branch');
      router.push('/auth'); 
  };

  const handleFileUpload = (e) => {
    if (e.target.files[0]) setAssignmentFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const allSessions = JSON.parse(localStorage.getItem('ai_eval_sessions')) || [];
    const activeSession = allSessions.find(s => s.id === sessionId.toUpperCase().trim());

    if (!activeSession) {
      setIsSubmitting(false);
      setErrorMsg(`Invalid Session ID "${sessionId}". Please get the correct code from your teacher.`);
      return;
    }

    if (activeSession.branch !== "All Branches" && activeSession.branch !== userProfile.branch) {
      setIsSubmitting(false);
      setErrorMsg(`Access Denied! This session is only for ${activeSession.branch} students. Your profile branch is ${userProfile.branch}.`);
      return;
    }

    if (!assignmentFile) {
      setIsSubmitting(false);
      setErrorMsg("Please upload a PDF file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('assignment', assignmentFile);
      formData.append('studentName', userProfile.name);
      formData.append('regNumber', userProfile.regNumber);
      formData.append('sessionId', sessionId);
      formData.append('subject', activeSession.subject);
      formData.append('branch', userProfile.branch);
      formData.append('semester', activeSession.semester);

      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://assignment-evaluator-14ie.onrender.com';
      const response = await fetch(`${BACKEND_URL}/api/evaluate`, {
        method: 'POST',
        body: formData,
      });

      const aiData = await response.json();

      if (!response.ok) {
        throw new Error(aiData.error || "AI Evaluation failed at backend.");
      }

      let statusColor = 'text-red-600 bg-red-100';
      if (aiData.score >= 8) statusColor = 'text-green-600 bg-green-100';
      else if (aiData.score >= 5) statusColor = 'text-orange-600 bg-orange-100';

      const formattedParams = (aiData.parameters || []).map(p => ({
        ...p,
        color: p.score >= (p.max * 0.75) ? 'bg-green-500' : p.score >= (p.max * 0.4) ? 'bg-orange-500' : 'bg-red-500'
      }));

      const finalResult = {
        id: sessionId,
        roll: userProfile.regNumber,
        name: userProfile.name,
        branch: userProfile.branch,
        semester: activeSession.semester,
        subject: activeSession.subject,
        date: new Date().toLocaleString(),
        score: aiData.score,
        maxScore: 10,
        percentage: Math.round((aiData.score / 10) * 100),
        status: aiData.status,
        statusColor,
        parameters: formattedParams,
        strengths: aiData.strengths || ["Attempted the assignment."],
        improvements: aiData.improvements || ["Review the core concepts again."]
      };

      setEvalResult(finalResult);

      const existingSubmissions = JSON.parse(localStorage.getItem('ai_eval_submissions')) || [];
      existingSubmissions.push(finalResult);
      localStorage.setItem('ai_eval_submissions', JSON.stringify(existingSubmissions));

    } catch (error) {
      console.error("Error:", error);
      setErrorMsg(error.message || "Failed to connect to Groq AI Server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEvalResult(null);
    setAssignmentFile(null);
    setSessionId('');
    setErrorMsg('');
  };

  if (!userProfile) return null;

  const LockIcon = () => (
    <svg className="w-4 h-4 text-[#A3AED0] absolute right-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-[#F4F7FE]">
      {/* RESPONSIVE SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#0B1437] flex flex-col md:h-screen sticky top-0 shadow-2xl z-20 transition-all">
        
        {/* 🌟 NEW BIG HOME BUTTON (TOP) */}
        <div className="p-4 border-b border-white/10 hidden md:block">
            <Link href="/" className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white py-3 rounded-xl font-bold transition-all text-sm">
              <span className="text-lg">🏠</span> Go to Home Page
            </Link>
        </div>

        <div className="p-6 md:p-8 flex justify-between items-center">
          {/* 🌟 LOGO NOW LINKS TO HOME PAGE */}
          <Link href="/" className="flex items-center gap-3 md:gap-4 hover:opacity-90 transition-opacity">
            <div className="bg-gradient-to-br from-violet-500 to-indigo-600 p-2 md:p-2.5 rounded-xl text-white shadow-lg">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">AIEval<span className="text-violet-500">.</span></h1>
          </Link>
          
          <button className="md:hidden text-white focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
          </button>
        </div>

        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 px-4 md:px-6 pb-6 md:pb-0`}>
          <nav className="space-y-2 flex-1 mt-2 md:mt-4">
            
            {/* Mobile Only Home Button */}
            <Link href="/" className="md:hidden w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all text-slate-400 hover:bg-white/5 hover:text-white mb-2">
              <span className="text-lg">🏠</span>Home Page
            </Link>

            {['New Submission', 'My History'].map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setSelectedHistoryItem(null); setIsMobileMenuOpen(false); if (tab === 'New Submission') resetForm(); }}
                className={`w-full flex items-center gap-4 px-4 py-3 md:px-5 md:py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-indigo-600 text-white translate-x-1' : 'text-slate-400 hover:bg-white/5'}`}>
                <span className="text-lg">{tab === 'New Submission' ? '📤' : '📊'}</span>{tab}
              </button>
            ))}
          </nav>
          
          <div className="mt-4 p-4 md:p-6 bg-black/20 rounded-2xl md:rounded-none md:border-t border-white/5 flex justify-between items-center">
            <div className="flex flex-col truncate pr-2">
              <div className="text-sm font-bold text-white truncate">{userProfile.name}</div>
              <div className="text-[10px] md:text-xs font-bold text-indigo-400">{userProfile.regNumber}</div>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-8 md:p-12 overflow-x-hidden">
        {activeTab === 'New Submission' && (
          <div className="max-w-4xl mx-auto">
            <header className="mb-6 md:mb-8"><h2 className="text-3xl md:text-4xl font-extrabold text-[#1B254B]">Assignment Submission</h2></header>

            {!isSubmitting && !evalResult && (
              <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-10 rounded-2xl md:rounded-[32px] shadow-sm border border-slate-100">
                {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 text-sm">❌ {errorMsg}</div>}
                
                <div className="mb-6 md:mb-8 border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6 bg-slate-50">
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        <h3 className="text-xs md:text-sm font-bold text-[#1B254B] uppercase tracking-wide">Verified Identity</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="relative">
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">Registration No.</label>
                            <input disabled type="text" value={userProfile.regNumber} className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-slate-200/50 border border-transparent text-slate-600 rounded-lg md:rounded-xl outline-none font-bold text-sm md:text-base cursor-not-allowed" />
                            <LockIcon />
                        </div>
                        <div className="relative">
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">Full Name</label>
                            <input disabled type="text" value={userProfile.name} className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-slate-200/50 border border-transparent text-slate-600 rounded-lg md:rounded-xl outline-none font-bold text-sm md:text-base cursor-not-allowed" />
                            <LockIcon />
                        </div>
                        <div className="md:col-span-2 relative">
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 mb-1">Department</label>
                            <input disabled type="text" value={userProfile.branch} className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-slate-200/50 border border-transparent text-slate-600 rounded-lg md:rounded-xl outline-none font-bold text-sm md:text-base cursor-not-allowed" />
                            <LockIcon />
                        </div>
                    </div>
                </div>

                <div className="mb-6 md:mb-8">
                    <label className="block text-xs md:text-sm font-bold text-[#2B3674] mb-2">Session ID *</label>
                    <input type="text" required value={sessionId} onChange={(e) => setSessionId(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3.5 md:px-5 md:py-4 bg-[#F4F7FE] border-none rounded-lg md:rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-indigo-600 font-mono font-black tracking-widest text-sm md:text-base placeholder:text-slate-400 placeholder:font-sans placeholder:font-medium placeholder:tracking-normal"
                      placeholder="Enter 8-digit code" />
                </div>

                <div className="mb-6 md:mb-8">
                  <label className="block text-xs md:text-sm font-bold text-[#2B3674] mb-2 md:mb-3">Upload Assignment (PDF) *</label>
                  <label className={`block border-2 border-dashed rounded-xl md:rounded-3xl p-6 md:p-10 text-center cursor-pointer transition-all ${assignmentFile ? 'border-green-400 bg-green-50' : 'border-indigo-200 bg-[#F4F7FE] hover:border-indigo-500'}`}>
                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                    {assignmentFile
                      ? <div><div className="text-3xl md:text-4xl mb-2 md:mb-3 text-green-500">✅</div><p className="font-bold text-green-700 text-sm md:text-base truncate px-2">{assignmentFile.name}</p></div>
                      : <div><div className="text-3xl md:text-4xl mb-2 md:mb-4 text-indigo-400">📤</div><p className="font-bold text-[#1B254B] text-sm md:text-base">Drop your PDF here</p><p className="text-xs md:text-sm font-medium text-[#A3AED0] mt-1 md:mt-2">Max 10MB</p></div>
                    }
                  </label>
                </div>

                <button type="submit" disabled={!assignmentFile || !sessionId}
                  className="w-full bg-[#1B254B] disabled:bg-slate-300 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-black transition-all shadow-xl shadow-[#1B254B]/20">
                  ✨ Evaluate with AI
                </button>
              </form>
            )}

            {isSubmitting && (
              <div className="bg-white p-10 md:p-20 rounded-2xl md:rounded-[32px] text-center border border-slate-100 shadow-sm">
                <div className="text-5xl md:text-6xl mb-4 animate-bounce">⚡</div>
                <h3 className="text-xl md:text-2xl font-black text-[#1B254B]">Groq AI is Analyzing...</h3>
                <p className="text-sm md:text-base text-[#A3AED0] font-medium mt-2">Semantic extraction in progress</p>
              </div>
            )}

            {!isSubmitting && evalResult && (
              <div className="space-y-4 md:space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[32px] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center bg-indigo-50 rounded-full border-4 md:border-8 border-indigo-100 shrink-0">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-black text-indigo-600">{evalResult.score}</div>
                      <div className="text-xs md:text-sm font-bold text-indigo-400 mt-1 border-t border-indigo-200 pt-1">out of 10</div>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left w-full">
                    <span className={`inline-block px-3 py-1 text-[10px] md:text-xs font-bold rounded-lg mb-2 md:mb-3 ${evalResult.statusColor}`}>{evalResult.status}</span>
                    <h3 className="text-xl md:text-2xl font-black text-[#1B254B] mb-1 md:mb-2">Complete, {evalResult.name}!</h3>
                    <p className="text-sm md:text-base text-indigo-600 font-bold mb-4">{evalResult.subject} • {evalResult.branch}</p>
                    <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 md:gap-4">
                      <button onClick={resetForm} className="text-sm md:text-base text-indigo-600 font-bold hover:underline">← Submit Another</button>
                      <button onClick={() => { setActiveTab('My History'); setSelectedHistoryItem(null); }} className="bg-[#1B254B] text-white px-5 py-2.5 md:px-6 md:py-2 rounded-xl text-sm md:text-base font-bold hover:bg-black transition-colors w-full sm:w-auto">Go to History</button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[32px] shadow-sm border border-slate-100">
                  <h3 className="text-lg md:text-xl font-bold text-[#1B254B] mb-4 md:mb-6">Detailed Parameter Breakdown</h3>
                  <div className="space-y-4 md:space-y-6">
                    {evalResult.parameters.map((param, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-end mb-1.5 md:mb-2">
                          <span className="font-bold text-xs md:text-sm text-[#2B3674]">{param.name}</span>
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-xs md:text-sm font-bold text-[#1B254B] bg-[#F4F7FE] px-2 py-1 md:px-3 rounded-md">{param.score} / {param.max}</span>
                            <span className="hidden sm:inline text-[10px] md:text-xs font-bold text-slate-500">{param.status}</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 md:h-3">
                          <div className={`${param.color} h-2 md:h-3 rounded-full transition-all duration-1000`} style={{ width: `${(param.score / param.max) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-green-50 p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-green-100">
                    <h3 className="text-base md:text-lg font-bold text-green-800 mb-3 md:mb-4">💪 Strengths</h3>
                    <ul className="space-y-2 md:space-y-3">
                      {evalResult.strengths.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-green-700 font-medium"><span className="shrink-0">✔️</span> {point}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-orange-100">
                    <h3 className="text-base md:text-lg font-bold text-orange-800 mb-3 md:mb-4">💡 Areas to Improve</h3>
                    <ul className="space-y-2 md:space-y-3">
                      {evalResult.improvements.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-orange-700 font-medium"><span className="shrink-0">🔧</span> {point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MY HISTORY */}
        {activeTab === 'My History' && (
          <div className="max-w-4xl mx-auto">
            {!selectedHistoryItem ? (
              <>
                <header className="mb-6 md:mb-8"><h2 className="text-3xl md:text-4xl font-extrabold text-[#1B254B]">My Submissions</h2></header>
                <div className="space-y-4 md:space-y-6">
                  {myHistory.length > 0 ? myHistory.map((sub, idx) => (
                    <div key={idx} className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[32px] shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                      <div className="w-full sm:w-auto">
                        <h3 className="text-lg md:text-xl font-bold text-[#1B254B] line-clamp-1">{sub.subject}</h3>
                        <p className="text-xs md:text-sm font-bold text-indigo-500 mb-1">Session: {sub.id}</p>
                        <p className="text-[10px] md:text-xs font-medium text-[#A3AED0]">{sub.date}</p>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-0 border-slate-100 pt-3 sm:pt-0 mt-1 sm:mt-0">
                        <div className="flex flex-col items-start sm:items-end">
                            <div className="text-xl md:text-2xl font-black text-[#1B254B]">{sub.score} <span className="text-xs md:text-sm text-slate-400">/ 10</span></div>
                            <span className={`inline-block px-2 md:px-3 py-1 text-[10px] md:text-xs font-bold rounded-md md:rounded-lg mt-1 sm:mb-3 ${sub.statusColor}`}>{sub.status}</span>
                        </div>
                        <button onClick={() => setSelectedHistoryItem(sub)}
                          className="bg-[#F4F7FE] text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="bg-white p-8 md:p-12 text-center rounded-2xl md:rounded-[32px] border border-slate-100">
                      <h3 className="text-lg md:text-xl font-bold text-[#1B254B]">No Submissions Yet</h3>
                      <p className="text-sm md:text-base text-[#A3AED0] mt-2">Submit an assignment to see results here.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4 md:space-y-6">
                <button onClick={() => setSelectedHistoryItem(null)} className="mb-2 md:mb-4 text-sm md:text-base text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-2">← Back to All</button>
                <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[32px] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="w-24 h-24 md:w-40 md:h-40 flex items-center justify-center bg-indigo-50 rounded-full border-4 md:border-8 border-indigo-100 shrink-0">
                    <div className="text-center">
                      <div className="text-2xl md:text-4xl font-black text-indigo-600">{selectedHistoryItem.score}</div>
                      <div className="text-[10px] md:text-sm font-bold text-indigo-400 mt-1 border-t border-indigo-200 pt-1">out of 10</div>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left w-full">
                    <span className={`inline-block px-2 md:px-3 py-1 text-[10px] md:text-xs font-bold rounded-md md:rounded-lg mb-2 md:mb-3 ${selectedHistoryItem.statusColor}`}>{selectedHistoryItem.status}</span>
                    <h3 className="text-xl md:text-2xl font-black text-[#1B254B] mb-1 md:mb-2">{selectedHistoryItem.subject}</h3>
                    <p className="text-sm md:text-base text-indigo-600 font-bold mb-1">Session ID: {selectedHistoryItem.id}</p>
                    <p className="text-xs md:text-sm font-medium text-slate-500 mb-2 md:mb-4">{selectedHistoryItem.branch} • {selectedHistoryItem.semester}</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[32px] shadow-sm border border-slate-100">
                  <h3 className="text-lg md:text-xl font-bold text-[#1B254B] mb-4 md:mb-6">Detailed Parameter Breakdown</h3>
                  <div className="space-y-4 md:space-y-6">
                    {selectedHistoryItem.parameters.map((param, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-end mb-1.5 md:mb-2">
                          <span className="font-bold text-xs md:text-sm text-[#2B3674]">{param.name}</span>
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-xs md:text-sm font-bold text-[#1B254B] bg-[#F4F7FE] px-2 md:px-3 py-1 rounded-md">{param.score} / {param.max}</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 md:h-3">
                          <div className={`${param.color} h-2 md:h-3 rounded-full transition-all duration-1000`} style={{ width: `${(param.score / param.max) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}