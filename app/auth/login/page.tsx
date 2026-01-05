'use client'
import { useState } from 'react'
import { supabase } from '../../utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // محاولة تسجيل الدخول
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert("خطأ في الدخول: " + error.message)
    } else {
      // لو نجح، حوله للداشبورد فوراً
      router.push('/dashboard/hero')
    }
    setLoading(false)
  }

  return (
    <div className="app min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#8750f7]">تسجيل الدخول</h2>
        
        <div className="space-y-4 mb-3">
          <div>
            <label className="block mb-2 text-sm text-gray-400">البريد الإلكتروني</label>
            <input 
              type="email" 
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none transition-all text-white"
              placeholder="example@mail.com"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-400">كلمة المرور</label>
            <input 
              type="password" 
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none transition-all text-white"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-8 bg-[#8750f7] hover:bg-[#6b3be6]/80 p-3 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          {loading ? 'جاري التحقق...' : 'دخول'}
        </button>

        <p className="mt-6 text-center text-gray-400 text-sm">
          ليس لديك حساب؟ 
          <Link href="/auth/register" className="text-blue-400 hover:underline mr-1">إنشاء حساب جديد</Link>
        </p>
      </form>
    </div>
  )
}