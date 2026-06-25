"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BRANCHES = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering"
];

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', regNumber: '', branch: BRANCHES[0]
  });

  // 🌟 FIXED REDIRECT LOOP: Smart Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const params = new URLSearchParams(window.location.search);
    const requestedRole = params.get('role');

    // Agar token hai, check karo ki user same role khol raha hai ya dusra
    if (token) {
        if (requestedRole && requestedRole !== userRole) {
            // Role alag hai, toh purana login saaf karo (Par vault/sessions safe rahenge)
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('regNumber');
            localStorage.removeItem('branch');
        } else {
            // Same role hai, toh dashboard bhej do
            if (userRole === 'teacher') return router.push('/teacher-dashboard');
            if (userRole === 'student') return router.push('/student-dashboard');
        }
    }

    if (requestedRole === 'teacher' || requestedRole === 'student') {
        setRole(requestedRole);
    }
  }, [router]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://assignment-evaluator-14ie.onrender.com';
    const url = isLogin 
      ? `${BACKEND_URL}/api/auth/login` 
      : `${BACKEND_URL}/api/auth/register`;

    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { ...formData, role };

    if (role === 'teacher' && !isLogin) {
      delete payload.regNumber;
      delete payload.branch;
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      if (isLogin) {
        setMsg({ type: 'success', text: 'Authentication successful. Entering workspace...' });
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userEmail', formData.email); 
        
        if(data.user.role === 'student') {
            localStorage.setItem('regNumber', data.user.regNumber);
            localStorage.setItem('branch', data.user.branch);
        }

        setTimeout(() => {
          if (data.user.role === 'teacher') router.push('/teacher-dashboard');
          else router.push('/student-dashboard');
        }, 1200);

      } else {
        setMsg({ type: 'success', text: 'Account created! Please sign in.' });
        setTimeout(() => {
            setIsLogin(true);
            setMsg({ type: '', text: '' });
        }, 1500);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none"></div>
      <div className="w-full max-w-[440px] z-10 animate-fade-in-up">
        
        <div className="text-center mb-8">
            <div className="bg-[#0A0A0A] w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/5 mx-auto mb-5 border border-white/10">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Access AIEval Workspace</h1>
            <p className="text-[#666666] text-sm mt-1.5 font-medium">Please enter your credentials to continue.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8">
            <Link href="/" className="inline-flex items-center text-xs font-bold text-[#666666] hover:text-[#0A0A0A] transition-colors mb-6">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                Return to Home
            </Link>

            <div className="flex bg-[#F4F4F5] p-1 rounded-lg mb-6">
                <button onClick={() => setRole('student')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${role === 'student' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-[#71717A] hover:text-[#0A0A0A]'}`}>🎓 Student</button>
                <button onClick={() => setRole('teacher')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${role === 'teacher' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-[#71717A] hover:text-[#0A0A0A]'}`}>👨‍🏫 Professor</button>
            </div>

            {msg.text && (
                <div className={`p-3.5 rounded-lg mb-6 text-xs font-bold flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                    {msg.type === 'error' ? '🚨' : '✨'} {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <label className="block text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-1.5">Full Name</label>
                        <input required type="text" name="name" onChange={handleChange} className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-[#0A0A0A] text-sm transition-all" placeholder="John Doe" />
                    </div>
                )}

                {!isLogin && role === 'student' && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-1.5">Reg Number</label>
                            <input required type="text" name="regNumber" onChange={handleChange} className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-[#0A0A0A] text-sm transition-all" placeholder="e.g. 21CS045" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-1.5">Branch</label>
                            <select required name="branch" onChange={handleChange} className="w-full px-3 py-2.5 bg-white border border-[#E4E4E7] rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-[#0A0A0A] text-sm transition-all">
                                {BRANCHES.map(b => <option key={b} value={b}>{b.split(' ')[0]}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-1.5">Email Address</label>
                    <input required type="email" name="email" onChange={handleChange} className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-[#0A0A0A] text-sm transition-all" placeholder="name@college.edu" />
                </div>

                <div>
                    <label className="block text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-1.5">Password</label>
                    <input required type="password" name="password" onChange={handleChange} className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-[#0A0A0A] text-sm transition-all" placeholder="••••••••" />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#0A0A0A] disabled:bg-[#A1A1AA] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#27272A] transition-all mt-2 flex justify-center items-center gap-2">
                    {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
            </form>
        </div>

        <div className="mt-6 text-center">
            <p className="text-[13px] font-medium text-[#71717A]">
                {isLogin ? "New to AIEval? " : "Already registered? "}
                <button type="button" onClick={() => { setIsLogin(!isLogin); setMsg({type:'', text:''}); }} className="text-[#0A0A0A] font-bold hover:underline">
                    {isLogin ? 'Create an account' : 'Sign in to workspace'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
}