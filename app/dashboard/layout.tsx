'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; 
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { 
  LayoutDashboard, Briefcase, FolderDot, User, 
  MessageSquare, Share2, LogOut 
} from 'lucide-react';
import toast from 'react-hot-toast';



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // تحديث الـ State ليشمل الـ logo_url
  const [userData, setUserData] = useState<{ 
    small_name: string; 
    full_name: string; 
    logo_url?: string 
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('hero')
          .select('small_name, full_name, logo_url') // جلب رابط اللوجو
          .eq('user_id', user.id)
          .single();
        if (data) setUserData(data);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      toast.success("Logged out successfully");
      router.push('/auth/login');
    }
  };

  const menuItems = [
    { name: 'Hero', icon: <LayoutDashboard size={22} />, href: '/dashboard/hero' },
    { name: 'About', icon: <User size={22} />, href: '/dashboard/about' },
    { name: 'Experience', icon: <Briefcase size={22} />, href: '/dashboard/experience' },
    { name: 'Projects', icon: <FolderDot size={22} />, href: '/dashboard/projects' },
    { name: 'Contact', icon: <MessageSquare size={22} />, href: '/dashboard/contact' },
    { name: 'Links', icon: <Share2 size={22} />, href: '/dashboard/portfoilo' },
  ];

  return (
    <div className="flex min-h-screen bg-[#050709] text-white font-sans">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-gray-800 bg-[#0b0f13] flex-col fixed h-full z-40">
        <div className="p-8">
          <div className="flex items-center gap-3 text-xl font-bold">
            {/* اللوجو العلوي: يعرض الصورة أو الحروف */}
            <div className="w-10 h-10 bg-[#8750f7] text-white rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-[#8750f7]/20 border border-white/10">
              {userData?.logo_url ? (
                <img src={userData.logo_url} className="w-full h-full object-cover" alt="Logo" />
              ) : (
                <span className="text-sm font-black tracking-tighter">{userData?.small_name || "XX"}</span>
              )}
            </div>
            <span className="tracking-tighter uppercase text-white text-lg">Dash<span className="text-[#8750f7]">.</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-[#8750f7] text-white shadow-lg shadow-[#8750f7]/20' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                  {item.icon}
                </span>
                <span className="font-bold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* الجزء السفلي: تسجيل الخروج والبروفايل */}
        <div className="p-4 border-t border-gray-800/50 space-y-4">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-400 transition-colors text-sm font-bold group"
           >
             <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
             Sign Out
           </button>

        </div>
      </aside>

      {/* 2. Mobile Nav & Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-10 pb-32 md:pb-10 transition-all">
        {/* Header for Mobile only */}
        <div className="md:hidden flex items-center justify-between mb-8 pt-2 px-2">
           <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#8750f7] rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-[#8750f7]/20">
                {userData?.logo_url ? (
                  <img src={userData.logo_url} className="w-full h-full object-cover" alt="Logo" />
                ) : (
                  <span className="text-[10px] font-black">{userData?.small_name || "XX"}</span>
                )}
              </div>
              <span className="font-black text-white text-sm uppercase tracking-tighter">Dashboard</span>
           </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#0b0f13]/90 backdrop-blur-xl border-t border-gray-800 z-100 px-2 pb-safe h-20">
        <div className="flex justify-around items-center h-full">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 transition-all ${
                  isActive ? 'text-[#8750f7]' : 'text-gray-500'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-[#8750f7]/10' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-tighter">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
