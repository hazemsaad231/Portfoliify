'use client';
import { useState, useEffect } from 'react';
import { Mail, Phone, MessageCircle } from "lucide-react";
import { supabase } from '../../utils/supabase'; // تأكد من صحة المسار

function Contact({ userId }: { userId: string }) {
  const [dbContact, setDbContact] = useState<any>(null);

  // 1. جلب البيانات من Supabase
  useEffect(() => {
    async function getContact() {
      const { data } = await supabase
        .from('contact_info')
        .select('*')
        .eq('user_id', userId)
        .single(); // لأننا نملك صفاً واحداً فقط
      
      if (data) 
      setDbContact(data);
    }
    getContact();
  }, []);

  // 2. تجهيز المصفوفة بالبيانات القادمة من الداتابيز (أو قيم افتراضية حتى تحميل البيانات)
  const contactItems = [
    {
      id: 'email',
      icon: <Mail size={30} />,
      label: dbContact?.email || 'your.email@example.com',
      href: `mailto:${dbContact?.email}`||'your.email@example.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'phone',
      icon: <Phone size={30} />,
      label: dbContact?.phone || '+1 (555) 123-4567',
      href: `tel:${dbContact?.phone}`||'your.phone.number',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'whatsapp',
      icon: <MessageCircle size={35} />,
      label: 'WhatsApp',
      href: dbContact?.whatsapp || 'https://wa.me/yourwhatsappnumber', // تأكد من وجود هذا العمود في الجدول
      color: 'from-green-400 to-green-600'
    }
  ];

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" }
  ];

  return (
    <div id="contact" className='px-4 sm:px-4 md:px-6 lg:px-8 xl:px-32 pb-12 mt-28 relative overflow-hidden'>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Title Section */}
        <div className="text-left space-y-3 mb-12">
          <h1 
            className="bg-linear-to-r from-[#8750f7] to-white bg-clip-text text-transparent text-4xl sm:text-5xl font-bold inline-block"
            style={{ WebkitTextFillColor: "transparent" }}>
            Contact Me <span className='w-4 h-4 bg-[#8750f7] inline-block rounded-full ml-2'></span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Let's connect and bring your ideas to life
          </p>
        </div>

        {/* Contact Cards */}
        <div className="w-full mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactItems.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                className="group relative bg-slate-900/50 border border-gray-700 hover:border-[#8750f7]/50 p-8 rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                
                <div className="relative flex items-center gap-6">
                  <div className={`p-4 rounded-xl bg-slate-800 group-hover:bg-[#8750f7]/20 transition-all duration-500`}>
                    <div className="text-white group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-widest mb-1">{item.id}</span>
                    <span className="text-white font-medium group-hover:text-[#8750f7] transition-colors duration-300 break-all">
                      {item.label}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-24 pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-center items-center gap-8">
          <nav className="flex flex-wrap gap-6 md:gap-10 text-lg">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8750f7] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Contact;