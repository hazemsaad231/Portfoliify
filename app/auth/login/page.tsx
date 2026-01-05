

'use client';

import { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('خطأ في تسجيل الدخول: ' + error.message);
    } else {
      router.push('/dashboard/hero'); // توجيه المستخدم لوحة التحكم بعد النجاح
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans" dir="ltr">
      <div className="w-full max-w-md">
        
        {/* Logo / Title Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#8750f7]/10 text-[#8750f7] mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Log in to manage your professional portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl shadow-2xl space-y-6">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="email" 
                placeholder="hazem@example.com"
                className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#8750f7] transition-all"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
              <button type="button" className="text-[10px] text-[#8750f7] hover:underline uppercase font-bold tracking-tighter">Forgot Password?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#8750f7] transition-all"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#8750f7] hover:bg-[#6b3be6] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#8750f7]/20 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Don't have an account? <button onClick={() => router.push('/auth/register')} className="text-[#8750f7] font-bold hover:underline">Register now</button>
        </p>
      </div>
    </div>
  );
}