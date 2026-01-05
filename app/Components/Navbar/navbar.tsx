

// 'use client';

// import { useState, useEffect } from "react";
// import { FaAlignRight } from "react-icons/fa6";
// import { motion, AnimatePresence } from 'framer-motion';
// import { supabase } from "../../utils/supabase";

// const NavBar = ({ userId }: { userId: string | null }) => {
//   const [isNavbarVisible, setNavbarVisible] = useState(false);
//   const [dbContact, setDbContact] = useState<any>({ small_name: 'HS', full_name: 'HAZEM SAAD' });
//   const [scrolled, setScrolled] = useState(false);

//   // تأثير التمرير لتغيير خلفية الـ Header
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 50) {
//         setScrolled(true);
//       } else {
//         setScrolled(false);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     async function getContact() {
//       if (!userId) return;
//       const { data } = await supabase
//         .from('hero')
//         .select('*')
//         .eq('user_id', userId)
//         .single();
//       if (data) setDbContact(data);
//     }
//     getContact();
//   }, [userId]);

//   const navLinks = [
//     { href: "#home", label: "Home" },
//     { href: "#about", label: "About" },
//     { href: "#experience", label: "Experience" },
//     { href: "#projects", label: "Projects" },
//     { href: "#contact", label: "Contact" },
//   ];

//   return (
//     <nav 
//       className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 ${
//         scrolled 
//         ? "py-3 bg-black/50 backdrop-blur-md shadow-xl" 
//         : "py-6 bg-transparent"
//       }`}
//     >
//       <div className='max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12'>
        
//         {/* Logo Section */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="flex flex-col"
//         >
//           <span className="text-2xl lg:text-3xl font-black tracking-tighter">
//             {userId ? dbContact?.small_name || "XX" : "XX"}
//             <span className="text-primary text-[#8750f7]">.</span>
//           </span>
//           <span className="text-[10px] uppercase tracking-[3px] font-medium">
//             {userId ? dbContact?.full_name : "Your Name"}
//           </span>
//         </motion.div>
        
//         {/* Desktop Navigation */}
//         <div className="hidden md:block">
//           <ul className='flex items-center gap-8'>
//             {navLinks.map((link, index) => (
//               <li key={index}>
//                 <a
//                   href={link.href}
//                   className="text-md lg:text-lg font-medium text-gray-200 hover:text-[#8750f7] transition-colors relative group"
//                 >
//                   {link.label}
//                   <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8750f7] transition-all duration-300 group-hover:w-full"></span>
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Mobile Menu Trigger */}
//         <div className="md:hidden flex items-center">
//           <button 
//             onClick={() => setNavbarVisible(true)}
//             className="p-2 text-white hover:text-[#8750f7] transition-colors"
//           >
//             <FaAlignRight size={24} />
//           </button>
//         </div>

//         {/* Mobile Menu Overlay */}
//         <AnimatePresence>
//           {isNavbarVisible && (
//             <motion.div
//               initial={{ x: '100%' }}
//               animate={{ x: 0 }}
//               exit={{ x: '100%' }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="fixed inset-0 w-full h-screen bg-black z-110 flex flex-col items-center justify-center"
//             >
//               <button 
//                 onClick={() => setNavbarVisible(false)}
//                 className="absolute top-8 right-8 text-white hover:text-[#8750f7] text-3xl"
//               >
//                 ✕
//               </button>
              
//               <ul className="flex flex-col gap-8 text-center">
//                 {navLinks.map((link, i) => (
//                   <motion.li 
//                     key={i}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.1 }}
//                   >
//                     <a
//                       href={link.href}
//                       className="text-3xl font-bold text-white hover:text-[#8750f7] transition-colors"
//                       onClick={() => setNavbarVisible(false)}
//                     >
//                       {link.label}
//                     </a>
//                   </motion.li>
//                 ))}
//               </ul>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;


'use client';

import { useState, useEffect } from "react";
import { FaAlignRight } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "../../utils/supabase";
import Link from "next/link"; // استيراد Link للتنقل بين الصفحات

const NavBar = ({ userId }: { userId: string | null }) => {
  const [isNavbarVisible, setNavbarVisible] = useState(false);
  // البيانات الافتراضية الاحترافية (HS / HAZEM SAAD)
  const [dbContact, setDbContact] = useState<any>();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function getContact() {
      if (!userId) return;
      const { data } = await supabase
        .from('hero')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (data) setDbContact(data);
    }
    getContact();
  }, [userId]);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 ${
        scrolled 
        ? "py-3 bg-black/80 backdrop-blur-md shadow-xl" 
        : "py-6 bg-transparent"
      }`}
    >
      <div className='max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12'>
        
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col cursor-default"
        >
          <span className="text-2xl lg:text-3xl font-black tracking-tighter text-white">
            {dbContact?.small_name || "XX"}
            <span className="text-[#8750f7]">.</span>
          </span>
          <span className="text-[10px] uppercase tracking-[3px] font-medium text-gray-400">
            {dbContact?.full_name || "Your Name"}
          </span>
        </motion.div>
        
        
{/* داخل الـ Desktop Navigation */}
<div className="hidden md:flex items-center gap-8">
  <ul className='flex items-center gap-8'>
    {navLinks.map((link, index) => (
      <li key={index}>
        <a href={link.href} className="text-md font-medium text-gray-200 hover:text-[#8750f7] transition-colors relative group">
          {link.label}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8750f7] transition-all duration-300 group-hover:w-full"></span>
        </a>
      </li>
    ))}
  </ul>

  {/* الشرط السحري: يظهر فقط لو مفيش userId (يعني في الصفحة الرئيسية) */}
  {!userId && (
    <Link 
      href="/auth/register" 
      className="bg-[#8750f7] text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-[#6b3be6] transition-all shadow-lg shadow-[#8750f7]/20"
    >
      Create Portfolio
    </Link>
  )}
</div>

{/* داخل الـ Mobile Menu Trigger */}

{/* داخل الـ Mobile Menu Trigger */}
<div className="md:hidden flex items-center gap-4">

  <button onClick={() => setNavbarVisible(true)} className="p-2 text-white hover:text-[#8750f7]">
    <FaAlignRight size={24} />
  </button>
</div>
      

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isNavbarVisible && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 w-full h-screen bg-black z-110 flex flex-col items-center justify-center"
            >
              <button 
                onClick={() => setNavbarVisible(false)}
                className="absolute top-8 right-8 text-white hover:text-[#8750f7] text-3xl"
              >
                ✕
              </button>
              
              <ul className="flex flex-col gap-8 text-center">
                {navLinks.map((link, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a
                      href={link.href}
                      className="text-3xl font-bold text-white hover:text-[#8750f7] transition-colors"
                      onClick={() => setNavbarVisible(false)}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
                {/* رابط تسجيل الدخول في الموبايل */}


                {!userId && (
                                  <motion.li
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.6 }}
                   className=""
                >
                  <Link 
                    href="auth/login" 
                    className="text-3xl font-bold text-[#8750f7]"
                    onClick={() => setNavbarVisible(false)}
                  >
                    Create Portfolio
                  </Link>
                </motion.li>
                )}

              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar;