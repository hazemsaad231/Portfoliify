'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // تنظيف اسم المستخدم: حروف صغيرة، بدون مسافات، حروف وأرقام فقط
    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_');

    // 1. إنشاء الحساب في نظام Auth الخاص بـ Supabase
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: fullName,
          user_name: cleanUsername,
        }
      }
    });

    if (signUpError) {
      toast.error('خطأ في التسجيل: ' + signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // 2. ربط المستخدم بجدول profiles لإنشاء رابط البورتفوليو
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id, 
            username: cleanUsername, 
            full_name: fullName 
          }
        ]);

      if (profileError) {
        console.error("Profile Error:", profileError.message);
        toast.error("تم إنشاء الحساب، ولكن حدثت مشكلة في إعداد الرابط الشخصي.");
      } else {
        toast.success('تم التسجيل بنجاح! افحص بريدك الإلكتروني لتفعيل الحساب.');
        router.push('/auth/login');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans" dir="ltr">
      <div className="w-full max-w-md">
        {/* Logo / Title Area */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#8750f7]/10 text-[#8750f7] mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Join Our Platform</h1>
          <p className="text-gray-500 mt-2">Create your unique portfolio in minutes</p>
        </div>

        <form onSubmit={handleSignUp} className="bg-[#0b0f13] border border-gray-800 p-6 rounded-3xl shadow-2xl space-y-4">
          
          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="text" 
                placeholder="Hazem Saad"
                className="w-full bg-black/40 border border-gray-800 rounded-2xl py-2 pl-12 pr-4 text-white outline-none focus:border-[#8750f7] transition-all"
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Username Input (Important for the URL) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Username (Your URL)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8750f7] font-bold">@</span>
              <input 
                type="text" 
                placeholder="hazem_dev"
                className="w-full bg-black/40 border border-gray-800 rounded-2xl py-2 pl-10 pr-4 text-white outline-none focus:border-[#8750f7] transition-all"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <p className="text-[10px] text-gray-600 mt-2 ml-1">
            </p>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="email" 
                placeholder="hazem@example.com"
                className="w-full bg-black/40 border border-gray-800 rounded-2xl py-2 pl-12 pr-4 text-white outline-none focus:border-[#8750f7] transition-all"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-black/40 border border-gray-800 rounded-2xl py-2 pl-12 pr-4 text-white outline-none focus:border-[#8750f7] transition-all"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#8750f7] hover:bg-[#6b3be6] text-white py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#8750f7]/20 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Already have an account? <button onClick={() => router.push('/auth/login')} className="text-[#8750f7] font-bold hover:underline">Login here</button>
        </p>
      </div>
    </div>
  );
}