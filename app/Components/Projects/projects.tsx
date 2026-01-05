
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronLeft, ChevronRight, Github, Loader2} from 'lucide-react';
import Image from 'next/image';
import { supabase } from '../../utils/supabase';

const Projects = ({ userId }: { userId: string }) => {
  const [active, setActive] = useState<string>(''); 
  const [expanded, setExpanded] = useState<string | null>(null); 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. جلب البيانات واستخراج التابات ديناميكياً
  useEffect(() => {
    async function fetchUserProjects() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', userId);
        
        if (data && data.length > 0) {
          setDbProjects(data);
          // استخراج أول تصنيف متاح ليكون هو المختار تلقائياً
          const categories = Array.from(new Set(data.map((p: any) => p.category)));
          setActive(categories[0]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserProjects();
  }, [userId]);

  // استخراج قائمة التابات من البيانات الفعلية فقط
  const dynamicTabs = Array.from(new Set(dbProjects.map((p: any) => p.category)))
    .map(cat => ({ id: cat, label: cat }));

  // فلترة المشاريع بناءً على التاب المختار
  const currentProjects = dbProjects.filter(project => project.category === active);

  // التحكم في عدد العناصر المعروضة حسب حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSlidesPerView(1);
      else if (window.innerWidth < 1024) setSlidesPerView(2);
      else setSlidesPerView(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // إعادة ضبط السلايدر عند تغيير التاب
  useEffect(() => {
    setCurrentSlide(0);
    setExpanded(null);
  }, [active]);

  const maxSlide = Math.max(0, currentProjects.length - slidesPerView);
  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, maxSlide));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  if (loading) return (
    <div className="py-40 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#8750f7]" size={40} />
      <p className="text-gray-500 animate-pulse">Loading amazing projects...</p>
    </div>
  );

  return (
    <div className="py-20 bg-[#050505]" id="projects">
      {/* العنوان */}
      <div className="px-4 sm:px-4 md:px-6 lg:px-8 xl:px-32">
        <div className="text-left w-full my-10">
          <h1 className="bg-linear-to-r from-[#8750f7] to-white pb-3 bg-clip-text text-transparent text-4xl sm:text-5xl font-bold inline-block">
            Projects <span className='w-4 h-4 bg-[#8750f7] inline-block rounded-full ml-2'></span>
          </h1>
        </div>
      </div>

      {/* تابات ديناميكية: تظهر فقط الأقسام التي تحتوي مشاريع */}
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex justify-start my-12"
        >
          <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-full backdrop-blur-md border border-slate-800 overflow-x-auto no-scrollbar">
            {dynamicTabs.length > 0 ? dynamicTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`relative px-8 py-3 rounded-full transition-all duration-300 whitespace-nowrap ${ active === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200' }`}
              >
                {active === tab.id && (
                  <motion.div layoutId="activeProjectTab" className="absolute inset-0 bg-[#8750f7] rounded-full" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                )}
                <span className="font-medium relative z-10">{tab.label}</span>
              </button>
            )) : (
                <p className="px-6 py-2 text-gray-600 text-sm">No categories found</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            {currentProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                {/* <FolderOff className="text-slate-700 mb-4" size={48} /> */}
                <p className="text-slate-500 text-lg">No projects added to this category yet.</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <motion.div
                  className="flex gap-5"
                  animate={{ x: `-${currentSlide * (100 / slidesPerView)}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {currentProjects.map((item: any) => {
                    const isExpanded = expanded === item.id;
                    return (
                      <motion.div
                        key={item.id}
                        className="shrink-0"
                        style={{ width: `calc(${100 / slidesPerView}% - ${(slidesPerView - 1) * 20 / slidesPerView}px)` }}
                      >
                        <div className="bg-[#0b0f13] rounded-3xl overflow-hidden shadow-xl hover:shadow-[#8750f7]/5 transition-all duration-500 flex flex-col h-full border border-slate-800 group">
                          {/* Image Container */}
                          <div className="h-64 relative overflow-hidden">
                            <Image 
                              src={item.image_url || '/placeholder.jpg'} 
                              alt={item.title} 
                              fill 
                              className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                              unoptimized // نستخدمها لتجاوز قيود الدومين مؤقتاً أو تأكد من إعداد next.config.js
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className="bg-black/60 backdrop-blur-md text-[#8750f7] text-[10px] font-bold px-3 py-1 rounded-full border border-[#8750f7]/30">
                                    {item.category}
                                </span>
                            </div>
                          </div>

                          <div className="p-7 flex flex-col text-left">
                            <h2 className="text-xl text-white font-bold mb-4 line-clamp-1">{item.title}</h2>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex gap-4">
                                {item.github_link && (
                                  <motion.a href={item.github_link} target="_blank" whileHover={{ y: -3, color: '#8750f7' }} className="text-slate-400">
                                    <Github size={22} />
                                  </motion.a>
                                )}
                                {item.live_link && (
                                  <motion.a href={item.live_link} target="_blank" whileHover={{ y: -3, color: '#8750f7' }} className="text-slate-400">
                                    <ExternalLink size={22} />
                                  </motion.a>
                                )}
                              </div>

                              <button
                                onClick={() => setExpanded(isExpanded ? null : item.id)}
                                className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-[#8750f7] transition-colors"
                              >
                                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                  <ChevronDown size={22} />
                                </motion.div>
                              </button>
                            </div>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }} 
                                  animate={{ height: "auto", opacity: 1 }} 
                                  exit={{ height: 0, opacity: 0 }} 
                                  className="overflow-hidden"
                                >
                                  <div className="mt-5 pt-5 border-t border-slate-800">
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                      {item.description}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            )}

            {/* أزرار التحكم بالسلايدر */}
            {currentProjects.length > slidesPerView && (
              <div className="flex justify-between items-center mt-10">
                <div className="flex gap-2">
                  {Array.from({ length: maxSlide + 1 }).map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentSlide(idx)} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${ idx === currentSlide ? 'bg-[#8750f7] w-12' : 'bg-slate-800 w-3 hover:bg-slate-700' }`} 
                    />
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <button onClick={prevSlide} disabled={currentSlide === 0} className={`w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center transition-all ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#8750f7] hover:border-[#8750f7] text-white'}`}>
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextSlide} disabled={currentSlide === maxSlide} className={`w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center transition-all ${currentSlide === maxSlide ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#8750f7] hover:border-[#8750f7] text-white'}`}>
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Projects;