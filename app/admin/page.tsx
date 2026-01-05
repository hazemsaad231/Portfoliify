'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase';
import { RefreshCw } from 'lucide-react';

export default function AdminGate() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/dashboard/hero'); // إذا كنت مسجل دخول يفتح الداشبورد
      } else {
        router.push('/auth/login'); // إذا لا، يطلب تسجيل دخول
      }
    };
    checkUser();
  }, [router]);

  return <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <RefreshCw className="animate-spin text-[#8750f7]" size={40} />
    </div>
}