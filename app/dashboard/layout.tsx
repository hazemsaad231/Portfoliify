'use client';
import Link from 'next/link';
import { LayoutDashboard, Briefcase, FolderDot , User, MessageSquare, Home } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, href: '/dashboard/hero' },
        { name: 'About & Skills', icon: <User size={20} />, href: '/dashboard/about' },
    { name: 'Experience', icon: <Briefcase size={20} />, href: '/dashboard/experience' },
    { name: 'Projects', icon: <FolderDot size={20} />, href: '/dashboard/projects' },
    { name: 'Contact', icon: <MessageSquare size={20} />, href: '/dashboard/contact' },
  ];

  return (
    <div className="flex min-h-screen bg-[#050709] text-white font-sans">
      {/* Sidebar الإحترافي */}
      <aside className="w-64 border-r border-gray-800 bg-[#0b0f13] flex flex-col fixed h-full">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#8750f7]">
            <Home size={24} />
            <span>PORTFOLIO</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 h-full flex flex-col items-start justify-center">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-[#8750f7]/10 hover:text-[#8750f7] transition-all group"
            >
              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
           <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-[#8750f7] flex items-center justify-center text-xs">H</div>
              <div className="text-xs">
                <p className="font-bold">Hazem</p>
                <p className="text-gray-500">Admin Mode</p>
              </div>
           </div>
        </div>
      </aside>

      {/* منطقة المحتوى */}
      <main className="flex-1 ml-64 p-10">
        {children}
      </main>
    </div>
  );
}