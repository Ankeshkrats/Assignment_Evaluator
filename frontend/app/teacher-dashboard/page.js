"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 

const ALL_BRANCHES = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering"
];

const ALL_SEMESTERS = [
  "1st Semester", "2nd Semester", "3rd Semester", "4th Semester", 
  "5th Semester", "6th Semester", "7th Semester", "8th Semester"
];

// Backend URL for fetching data from Cloud DB
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://assignment-evaluator-14ie.onrender.com';

export default function TeacherDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Active Sessions');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [mySessions, setMySessions] = useState([]);
  const [myVault, setMyVault] = useState([]);
  const [teacherEmail, setTeacherEmail] = useState('');

  const [subject, setSubject] = useState('');
  const [branch, setBranch] = useState(ALL_BRANCHES[0]);
  const [semester, setSemester] = useState(ALL_SEMESTERS[0]);
  const [questionFile, setQuestionFile] = useState(null); 
  const [answerKeyFile, setAnswerKeyFile] = useState(null); 
  const [showCode, setShowCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const [filterBranch, setFilterBranch] = useState('All');
  const [filterSemester, setFilterSemester] = useState('All');
  const [filterSubject, setFilterSubject] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    let email = localStorage.getItem('userEmail');
    
    if (!token || role !== 'teacher') {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      router.push('/auth?role=teacher');
      return;
    }
    
    if (!email) {
        email = 'professor@college.edu';
        localStorage.setItem('userEmail', email);
    }
    
    setTeacherEmail(email);
    fetchDashboardData(email);
  }, [router]);

  // --- NEW: Function to Fetch Data from Cloud DB ---
  const fetchDashboardData = async (email) => {
      try {
          // Fetch Sessions
          const sessRes = await fetch(`${BACKEND_URL}/api/sessions/${email}`);
          if (sessRes.ok) {
              const sessionsData = await sessRes.json();
              setMySessions(sessionsData);
          }

          // Fetch Submissions (Vault)
          const subRes = await fetch(`${BACKEND_URL}/api/submissions/${email}`);
          if (subRes.ok) {
              const submissionsData = await subRes.json();
              setMyVault(submissionsData);
          }
      } catch (error) {
          console.error("Failed to load dashboard data from cloud:", error);
      } finally {
          setLoading(false);
      }
  };

  const handleLogout = () => { 
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      router.push('/auth'); 
  };

  // --- NEW: Generate Session and Save to Cloud DB ---
  const generateSession = async (e) => {
    e.preventDefault();
    const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const newSession = {
      id: newCode,
      teacherId: teacherEmail, 
      subject,
      branch,
      semester,
      questionFileName: questionFile ? questionFile.name : null,
      answerKeyFileName: answerKeyFile ? answerKeyFile.name : null,
      date: new Date().toLocaleDateString()
    };

    try {
        // Save to Backend Database
        const response = await fetch(`${BACKEND_URL}/api/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSession)
        });

        if (response.ok) {
            setMySessions([newSession, ...mySessions]);
            setShowCode(newCode);
            setCopySuccess(false);
            setSubject('');
            setQuestionFile(null); 
            setAnswerKeyFile(null); 
        } else {
            alert("Failed to save session to cloud. Please try again.");
        }
    } catch (error) {
        console.error("Error saving session:", error);
        alert("Network error while saving session.");
    }
  };

  const handleCopyCode = () => {
      navigator.clipboard.writeText(showCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
  };

  const filteredVault = myVault.filter(student => {
    const matchBranch = filterBranch === 'All' || student.branch === filterBranch;
    const matchSem = filterSemester === 'All' || student.semester === filterSemester;
    const matchSub = filterSubject === '' || student.subject.toLowerCase().includes(filterSubject.toLowerCase());
    return matchBranch && matchSem && matchSub;
  });

  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    const dateStr = new Date().toLocaleString();
    const professorName = localStorage.getItem('userName') || 'Professor';

    printWindow.document.write(`
      <html>
        <head>
          <title>Evaluation Report - AIEval</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; }
            .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0 0 10px 0; color: #0f172a; font-size: 28px; }
            .meta-info { display: flex; justify-content: space-between; font-size: 14px; color: #475569; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
            th, td { border: 1px solid #cbd5e1; padding: 12px 15px; text-align: left; }
            th { background-color: #f8fafc; font-weight: bold; color: #334155; text-transform: uppercase; font-size: 12px; }
            .score { font-weight: bold; font-size: 16px; text-align: center; }
            .filters-applied { background: #f1f5f9; padding: 10px 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Academic Evaluation Report</h1>
            <p style="margin: 0; color: #64748b;">Generated via AIEval Automated System</p>
          </div>
          <div class="meta-info">
            <span><strong>Professor:</strong> ${professorName}</span>
            <span><strong>Generated On:</strong> ${dateStr}</span>
          </div>
          <div class="filters-applied">
            <strong>Filters Applied:</strong> 
            Branch: ${filterBranch} | Semester: ${filterSemester} | Subject Search: ${filterSubject || 'None'}
          </div>
          <table>
            <thead>
              <tr>
                <th>Registration No.</th>
                <th>Student Name</th>
                <th>Semester</th>
                <th>Subject</th>
                <th style="text-align: center;">Marks (out of 10)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredVault.length > 0 ? filteredVault.map(s => `
                <tr>
                  <td style="font-family: monospace;">${s.roll}</td>
                  <td><strong>${s.name}</strong></td>
                  <td>${s.semester}</td>
                  <td>${s.subject}</td>
                  <td class="score">${s.score}</td>
                </tr>
              `).join('') : `<tr><td colspan="5" style="text-align: center; padding: 30px;">No records found.</td></tr>`}
            </tbody>
          </table>
          <p style="text-align: center; margin-top: 50px; font-size: 12px; color: #94a3b8;">*** End of Official Report ***</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  if (loading) return null;

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

            {['Active Sessions', 'Create Session', 'The Vault'].map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setShowCode(''); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 md:px-5 md:py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-indigo-600 text-white translate-x-1' : 'text-slate-400 hover:bg-white/5'}`}>
                <span className="text-lg">{tab === 'Active Sessions' ? '📡' : tab === 'Create Session' ? '➕' : '🗄️'}</span>{tab}
              </button>
            ))}
          </nav>
          
          <div className="mt-4 p-4 md:p-6 bg-black/20 rounded-2xl md:rounded-none md:border-t border-white/5 flex justify-between items-center">
            <div className="flex flex-col truncate pr-2">
              <div className="text-sm font-bold text-white truncate">Prof. {localStorage.getItem('userName') || 'Teacher'}</div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Private Workspace</div>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-8 md:p-12 overflow-x-hidden">
        
        {/* ACTIVE SESSIONS */}
        {activeTab === 'Active Sessions' && (
          <div className="max-w-5xl mx-auto">
            <header className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B254B]">My Sessions</h2>
                    <p className="text-sm md:text-base text-[#A3AED0] font-medium mt-1">Showing only your generated session codes.</p>
                </div>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {mySessions.length > 0 ? mySessions.map((session, idx) => (
                <div key={idx} className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <span className="px-2 md:px-3 py-1 bg-indigo-50 text-indigo-600 font-bold text-[10px] md:text-xs rounded-md md:rounded-lg">{session.date}</span>
                    <span className="px-2 md:px-3 py-1 bg-slate-100 text-slate-500 font-bold text-[10px] md:text-xs rounded-md md:rounded-lg">{session.semester}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[#1B254B] mb-1 line-clamp-1">{session.subject}</h3>
                  <p className="text-xs md:text-sm font-medium text-[#A3AED0] mb-3 md:mb-4 line-clamp-1">{session.branch}</p>
                  
                  <div className="flex flex-col gap-2 mb-4 md:mb-6">
                    {session.questionFileName && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 bg-slate-100 text-slate-600 rounded">Q</span>
                        <span className="text-[10px] md:text-xs font-medium text-slate-500 truncate">{session.questionFileName}</span>
                      </div>
                    )}
                    {session.answerKeyFileName && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 bg-green-50 text-green-600 rounded">A</span>
                        <span className="text-[10px] md:text-xs font-medium text-slate-500 truncate">{session.answerKeyFileName}</span>
                      </div>
                    )}
                    {!session.questionFileName && !session.answerKeyFileName && (
                        <span className="text-[10px] md:text-xs font-medium text-slate-400 italic">No reference files uploaded</span>
                    )}
                  </div>

                  <div className="bg-[#F4F7FE] p-3 md:p-4 rounded-xl flex justify-between items-center">
                    <span className="font-mono font-black text-indigo-600 text-base md:text-lg tracking-widest">{session.id}</span>
                    <button onClick={() => { navigator.clipboard.writeText(session.id); alert("Code Copied!"); }} className="text-slate-400 hover:text-indigo-600 transition-colors p-1" title="Copy Session Code">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full bg-white p-8 md:p-12 text-center rounded-2xl md:rounded-[32px] border border-slate-100">
                  <h3 className="text-lg md:text-xl font-bold text-[#1B254B]">No Active Sessions</h3>
                  <p className="text-sm md:text-base text-[#A3AED0] mt-2 mb-4 md:mb-6">You haven't generated any evaluation sessions yet.</p>
                  <button onClick={() => {setActiveTab('Create Session'); setIsMobileMenuOpen(false);}} className="bg-indigo-50 text-indigo-600 font-bold px-5 py-2.5 md:px-6 md:py-2 rounded-lg hover:bg-indigo-100 text-sm md:text-base">Create One Now</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CREATE SESSION */}
        {activeTab === 'Create Session' && (
          <div className="max-w-3xl mx-auto">
            <header className="mb-6 md:mb-8"><h2 className="text-3xl md:text-4xl font-extrabold text-[#1B254B]">Generate Session</h2></header>
            <div className="bg-white p-5 sm:p-8 md:p-10 rounded-2xl md:rounded-[32px] shadow-sm border border-slate-100">
              <form onSubmit={generateSession} className="space-y-5 md:space-y-6">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-[#2B3674] mb-2">Subject Name</label>
                  <input required type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-3 md:px-5 md:py-4 bg-[#F4F7FE] border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-[#1B254B] font-bold text-sm md:text-base" placeholder="e.g. Data Structures" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-[#2B3674] mb-2">Target Branch</label>
                    <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full px-3 py-3.5 md:px-4 md:py-4 bg-[#F4F7FE] border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-[#1B254B] font-bold text-xs md:text-sm truncate">
                      <option value="All Branches">All Branches</option>
                      {ALL_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-[#2B3674] mb-2">Semester</label>
                    <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full px-3 py-3.5 md:px-4 md:py-4 bg-[#F4F7FE] border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-[#1B254B] font-bold text-xs md:text-sm">
                      {ALL_SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-2">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-[#2B3674] mb-2 md:mb-3">Upload Question Paper</label>
                    <label className={`block border-2 border-dashed rounded-2xl p-4 md:p-6 text-center cursor-pointer transition-all h-28 md:h-32 flex flex-col justify-center ${questionFile ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-[#F4F7FE] hover:border-indigo-400'}`}>
                      <input type="file" accept=".pdf" className="hidden" onChange={(e) => setQuestionFile(e.target.files[0])} />
                      {questionFile
                        ? <div><div className="text-2xl md:text-3xl mb-1 md:mb-2 text-indigo-500">📄</div><p className="font-bold text-indigo-700 text-xs md:text-sm truncate px-2">{questionFile.name}</p></div>
                        : <div><div className="text-2xl md:text-3xl mb-1 md:mb-2 text-slate-400">📝</div><p className="font-bold text-[#1B254B] text-xs md:text-sm">Questions PDF</p><p className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-[#A3AED0] mt-1">Optional RAG Context</p></div>
                      }
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-bold text-[#2B3674] mb-2 md:mb-3">Upload Model Answer</label>
                    <label className={`block border-2 border-dashed rounded-2xl p-4 md:p-6 text-center cursor-pointer transition-all h-28 md:h-32 flex flex-col justify-center ${answerKeyFile ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-[#F4F7FE] hover:border-green-400'}`}>
                      <input type="file" accept=".pdf" className="hidden" onChange={(e) => setAnswerKeyFile(e.target.files[0])} />
                      {answerKeyFile
                        ? <div><div className="text-2xl md:text-3xl mb-1 md:mb-2 text-green-500">✅</div><p className="font-bold text-green-700 text-xs md:text-sm truncate px-2">{answerKeyFile.name}</p></div>
                        : <div><div className="text-2xl md:text-3xl mb-1 md:mb-2 text-slate-400">💡</div><p className="font-bold text-[#1B254B] text-xs md:text-sm">Answer Key PDF</p><p className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-[#A3AED0] mt-1">Optional RAG Context</p></div>
                      }
                    </label>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#1B254B] text-white py-3.5 md:py-4 rounded-xl font-black text-base md:text-lg hover:bg-indigo-600 transition-all mt-2 md:mt-4 shadow-lg shadow-[#1B254B]/20">Generate 8-Digit Code</button>
              </form>

              {showCode && (
                <div className="mt-6 md:mt-8 p-6 md:p-8 bg-green-50 border border-green-200 rounded-[24px] text-center">
                  <p className="text-xs md:text-sm font-bold text-green-700 uppercase tracking-widest mb-3 md:mb-4">Session Activated</p>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-[#1B254B] tracking-widest bg-white inline-block px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl shadow-sm border border-green-100 mb-4 md:mb-6">{showCode}</div>
                  <div>
                    <button onClick={handleCopyCode} className={`w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold transition-all inline-flex justify-center items-center gap-2 shadow-lg text-sm md:text-base ${copySuccess ? 'bg-green-600 text-white' : 'bg-[#1B254B] text-white hover:bg-indigo-600'}`}>
                      {copySuccess ? 'Copied to Clipboard!' : 'Copy Code'}
                    </button>
                  </div>
                  <p className="text-xs md:text-sm font-medium text-green-600 mt-4 md:mt-6">Share this exact code with your students.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* THE VAULT */}
        {activeTab === 'The Vault' && (
          <div className="max-w-6xl mx-auto">
             <header className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B254B]">The Vault</h2>
                    <p className="text-sm md:text-base text-[#A3AED0] font-medium mt-1">Filter, sort, and export submissions.</p>
                </div>
            </header>

            <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row sm:flex-wrap gap-4 items-start sm:items-end">
              <div className="w-full sm:w-auto">
                <label className="block text-[10px] md:text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider mb-1.5 md:mb-2">Branch</label>
                <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="w-full sm:w-40 md:w-48 bg-[#F4F7FE] text-[#1B254B] font-bold text-xs md:text-sm px-3 py-2 md:px-4 md:py-2.5 rounded-lg border-none outline-none focus:ring-2 focus:ring-indigo-500 truncate">
                  <option value="All">All Branches</option>
                  {ALL_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              
              <div className="w-full sm:w-auto">
                <label className="block text-[10px] md:text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider mb-1.5 md:mb-2">Semester</label>
                <select value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)} className="w-full sm:w-32 md:w-40 bg-[#F4F7FE] text-[#1B254B] font-bold text-xs md:text-sm px-3 py-2 md:px-4 md:py-2.5 rounded-lg border-none outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="All">All Semesters</option>
                  {ALL_SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="w-full sm:w-auto flex-1">
                <label className="block text-[10px] md:text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider mb-1.5 md:mb-2">Subject (Type to Search)</label>
                <input 
                  type="text" 
                  value={filterSubject} 
                  onChange={(e) => setFilterSubject(e.target.value)} 
                  placeholder="e.g. DSA"
                  className="w-full bg-[#F4F7FE] text-[#1B254B] font-bold text-xs md:text-sm px-3 py-2 md:px-4 md:py-2.5 rounded-lg border-none outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>

              <div className="w-full sm:w-auto sm:ml-auto flex flex-col sm:flex-row gap-3 pt-2 sm:pt-0">
                <button onClick={() => { setFilterBranch('All'); setFilterSemester('All'); setFilterSubject(''); }} className="text-slate-400 font-bold text-xs md:text-sm hover:text-indigo-600 transition-colors px-2 py-2 text-center sm:text-left">
                  Reset
                </button>
                <button onClick={handlePrintReport} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 md:px-5 rounded-lg font-bold text-xs md:text-sm hover:bg-indigo-700 transition-all flex justify-center items-center gap-2 shadow-md">
                  Export PDF
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-[#F4F7FE] border-b border-slate-100">
                    <tr>
                      <th className="p-4 md:p-5 text-[10px] md:text-xs font-bold text-[#A3AED0] uppercase tracking-wider whitespace-nowrap">Date</th>
                      <th className="p-4 md:p-5 text-[10px] md:text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Student</th>
                      <th className="p-4 md:p-5 text-[10px] md:text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Session Info</th>
                      <th className="p-4 md:p-5 text-[10px] md:text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Status</th>
                      <th className="p-4 md:p-5 text-[10px] md:text-xs font-bold text-[#A3AED0] uppercase tracking-wider text-center">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVault.length > 0 ? filteredVault.map((student, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 md:p-5 text-xs md:text-sm font-medium text-[#A3AED0] whitespace-nowrap">{student.date.split(',')[0]}</td>
                        <td className="p-4 md:p-5">
                          <div className="font-bold text-sm md:text-base text-[#1B254B] line-clamp-1">{student.name}</div>
                          <div className="text-[10px] md:text-xs font-bold text-indigo-400">{student.roll}</div>
                        </td>
                        <td className="p-4 md:p-5">
                          <div className="font-bold text-sm md:text-base text-[#2B3674] line-clamp-1">{student.subject}</div>
                          <div className="text-[10px] md:text-xs font-medium text-[#A3AED0] font-mono mt-0.5 md:mt-1">ID: {student.id}</div>
                        </td>
                        <td className="p-4 md:p-5">
                          <span className={`px-2 py-1 md:px-3 rounded-lg text-[10px] md:text-xs font-bold ${student.statusColor}`}>{student.status}</span>
                        </td>
                        <td className="p-4 md:p-5 text-center font-black text-base md:text-lg text-[#1B254B]">{student.score}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="6" className="p-10 md:p-16 text-center text-[#A3AED0] font-bold text-sm md:text-lg">No matching submissions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}