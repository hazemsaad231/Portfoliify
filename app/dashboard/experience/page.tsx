'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { 
  Briefcase, Plus, Save, Trash2, Edit3, 
  X, RefreshCw, Calendar, MapPin, CheckCircle2 
} from 'lucide-react';

export default function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [formData, setFormData] = useState({ id: '', name: '', title: '', text: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // 1. جلب الخبرات الخاصة بالمستخدم الحالي فقط
  const fetchExperiences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id) // فلترة بالـ ID الخاص بالمستخدم
        .order('created_at', { ascending: false });
      
      if (data) setExperiences(data);
    } catch (err) {
      console.error("Error fetching experiences:", err);
    }
  };

  useEffect(() => { fetchExperiences(); }, []);

  // 2. معالجة الإضافة والتعديل
 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setStatus(null);

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Authentication required");

    // 1. نجهز البيانات بدون الـ ID في البداية
    const experienceData: any = {
      name: formData.name,
      title: formData.title,
      text: formData.text,
      date: formData.date,
      user_id: user.id
    };

    if (formData.id) {
      // حالة التعديل: نستخدم الـ ID الموجود للتحديث
      const { error } = await supabase
        .from('experiences')
        .update(experienceData)
        .eq('id', formData.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      setStatus({ type: 'success', msg: 'Experience updated!' });
    } else {
      // حالة الإضافة الجديدة: نرسل البيانات بدون حقل الـ id نهائياً
      // Supabase سيقوم بإنشاء UUID تلقائي فريد لكل سطر
      const { error } = await supabase
        .from('experiences')
        .insert([experienceData]); 
      
      if (error) throw error;
      setStatus({ type: 'success', msg: 'New experience added!' });
    }

    // تنظيف الفورم
    setFormData({ id: '', name: '', title: '', text: '', date: '' });
    setIsAddingNew(false);
    fetchExperiences();
  } catch (err: any) {
    setStatus({ type: 'error', msg: err.message || 'Something went wrong' });
  } finally {
    setLoading(false);
    setTimeout(() => setStatus(null), 3000);
  }
};
  // 3. الحذف مع التأكد من ملكية المستخدم للسجل
  const handleDelete = async (id: any) => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
          .from('experiences')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id); // لا يمكن حذف سجل لا يملكه المستخدم

        fetchExperiences();
        setStatus({ type: 'success', msg: 'Deleted successfully' });
      } catch (err) {
        setStatus({ type: 'error', msg: 'Delete failed' });
      }
    }
  };

  const startEdit = (exp: any) => {
    setFormData(exp);
    setIsAddingNew(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && experiences.length === 0) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <RefreshCw className="animate-spin text-[#8750f7]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 p-6 md:p-12 font-sans" dir="ltr">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-gray-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Work Experience <span className="text-[#8750f7]">.</span></h1>
            <p className="text-gray-500 mt-1">Manage your professional career timeline</p>
          </div>
          
          <button 
            onClick={() => {
                setIsAddingNew(!isAddingNew);
                if(isAddingNew) setFormData({ id: '', name: '', title: '', text: '', date: '' });
            }}
            className={`${isAddingNew ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-[#8750f7] text-white'} px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border shadow-lg`}
          >
            {isAddingNew ? <><X size={18}/> Cancel</> : <><Plus size={18}/> Add New Experience</>}
          </button>
        </div>

        {status && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            <CheckCircle2 size={18}/> {status.msg}
          </div>
        )}

        {/* Form Section */}
        {isAddingNew && (
          <div className="animate-in fade-in slide-in-from-top duration-300 mb-12">
            <form onSubmit={handleSubmit} className="bg-[#0b0f13] p-8 rounded-3xl border border-gray-800 shadow-2xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit3 size={20} className="text-[#8750f7]"/>
                {formData.id ? 'Edit Experience' : 'New Experience Details'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Job Title</label>
                  <input 
                    placeholder="e.g. Senior Frontend Developer" 
                    className="w-full p-4 bg-black/40 border border-gray-800 rounded-2xl outline-none focus:border-[#8750f7] transition-all text-white"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Company Name</label>
                  <input 
                    placeholder="e.g. Google Inc." 
                    className="w-full p-4 bg-black/40 border border-gray-800 rounded-2xl outline-none focus:border-[#8750f7] transition-all text-white"
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Duration / Date Range</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                  <input 
                    placeholder="e.g. Jan 2022 - Present" 
                    className="w-full p-4 pl-12 bg-black/40 border border-gray-800 rounded-2xl outline-none focus:border-[#8750f7] transition-all text-white"
                    value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                <textarea 
                  placeholder="Describe your responsibilities and achievements..." 
                  className="w-full p-4 bg-black/40 border border-gray-800 rounded-2xl h-32 outline-none focus:border-[#8750f7] transition-all resize-none text-white"
                  value={formData.text} onChange={(e) => setFormData({...formData, text: e.target.value})}
                />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#8750f7] py-4 rounded-2xl font-bold hover:bg-[#6b3be6] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8750f7]/20 disabled:opacity-50">
                {loading ? <RefreshCw className="animate-spin" size={20}/> : <Save size={20}/>}
                {formData.id ? 'Save' : 'Create'}
              </button>
            </form>
          </div>
        )}

        {/* List Section */}
        <div className="space-y-4">
          <h3 className="text-gray-500 font-bold uppercase tracking-tighter text-sm mb-4">Current Timeline</h3>
          {experiences.length === 0 ? (
            <div className="text-center py-20 bg-[#0b0f13] rounded-3xl border border-dashed border-gray-800">
                <Briefcase size={40} className="mx-auto text-gray-700 mb-3"/>
                <p className="text-gray-500">No experiences added yet.</p>
            </div>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="group flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0b0f13] p-6 rounded-3xl border border-gray-800 hover:border-[#8750f7]/50 transition-all animate-in fade-in duration-500">
                <div className="flex gap-4">
                  <div className="bg-[#8750f7]/10 p-4 rounded-2xl text-[#8750f7] hidden sm:block h-fit">
                    <Briefcase size={24}/>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#8750f7] transition-colors">{exp.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><MapPin size={14}/> {exp.title}</span>
                      <span className="flex items-center gap-1"><Calendar size={14}/> {exp.date}</span>
                    </div>
                    {exp.text && <p className="text-gray-500 text-sm mt-3 line-clamp-2 max-w-xl">{exp.text}</p>}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto border-t md:border-t-0 border-gray-800 pt-4 md:pt-0">
                  <button 
                    onClick={() => startEdit(exp)} 
                    className="flex-1 md:flex-none p-2 px-4 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-sm font-bold"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(exp.id)} 
                    className="flex-1 md:flex-none p-2 px-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}