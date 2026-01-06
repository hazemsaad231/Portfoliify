'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, FolderDot, User, MessageSquare, Home, Share2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Hero', icon: <LayoutDashboard size={22} />, href: '/dashboard/hero' },
    { name: 'About', icon: <User size={22} />, href: '/dashboard/about' },
    { name: 'Experience', icon: <Briefcase size={22} />, href: '/dashboard/experience' },
    { name: 'Projects', icon: <FolderDot size={22} />, href: '/dashboard/projects' },
    { name: 'Contact', icon: <MessageSquare size={22} />, href: '/dashboard/contact' },
    { name: 'Links', icon: <Share2 size={22} />, href: '/dashboard/portfoilo' }, // تم تصحيح الاسم هنا
  ];

  return (
    <div className="flex min-h-screen bg-[#050709] text-white font-sans">
      
      {/* 1. Desktop Sidebar (Visible only on md and up) */}
      <aside className="hidden md:flex w-64 border-r border-gray-800 bg-[#0b0f13] flex-col fixed h-full z-40">
        <div className="p-8">
          <div className="flex items-center gap-2 text-xl font-bold text-[#8750f7]">
            <Home size={24} />
            <span className="tracking-tighter uppercase text-white">Console<span className="text-[#8750f7]">.</span></span>
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

        <div className="p-6 border-t border-gray-800/50">
           <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#8750f7] to-[#b388ff] flex items-center justify-center font-bold">H</div>
              <div className="text-[10px]">
                <p className="font-bold text-gray-200 uppercase">Hazem</p>
                <p className="text-[#8750f7]">Premium Editor</p>
              </div>
           </div>
        </div>
      </aside>

      {/* 2. Mobile Bottom Navigation (Visible only on small screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#0b0f13]/90 backdrop-blur-xl border-t border-gray-800 z-100 px-2 pb-safe">
        <div className="flex justify-around items-center h-20">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${
                  isActive ? 'text-[#8750f7]' : 'text-gray-500'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-[#8750f7]/10' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 3. Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-10 pb-32 md:pb-10 transition-all">
        {/* Header for Mobile only */}
        <div className="md:hidden flex items-center justify-between mb-8 pt-4">
           <div className="flex items-center gap-2 text-lg font-bold">
              <div className="w-8 h-8 rounded-lg bg-[#8750f7] flex items-center justify-center"><Home size={16}/></div>
              <span className="tracking-tight text-white uppercase">Console</span>
           </div>
           <div className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-xs font-bold">H</div>
        </div>

        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}