'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { 
  Plus, Save, RefreshCw, Image as ImageIcon, 
  Trash2, Edit3, ExternalLink, Github, 
  Layers, X, CheckCircle2, UploadCloud 
} from 'lucide-react';

export default function AllProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  
  const [formData, setFormData] = useState({
    id: '', title: '', description: '', image_url: '', live_link: '', github_link: '', category: 'React'
  });

  const categories = ['React', 'Next.js', 'JavaScript', 'Vue', 'Angular', 'Mobile', 'UI/UX'];

  useEffect(() => { 
    fetchProjects(); 
  }, []);

  // 1. جلب المشاريع مع التأكد من جلب كل الحقول وفلترتها للمستخدم الحالي
  async function fetchProjects() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('projects')
        .select('*') // إصلاح: جلب كل الأعمدة وليس فقط user_id
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }

  // 2. معالجة رفع الصور وتوليد رابط Public
  const handleImageUpload = async (e: any) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      setStatus({ type: 'success', msg: 'Image uploaded successfully!' });
    } catch (error: any) {
      setStatus({ type: 'error', msg: error.message });
    } finally {
      setUploading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  // 3. حفظ المشروع (إضافة أو تعديل) مع ربطه بالـ user_id
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const projectData = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        live_link: formData.live_link,
        github_link: formData.github_link,
        category: formData.category,
        user_id: user.id // ربط المشروع بصاحبه
      };

      if (formData.id) {
        // حالة التعديل
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', formData.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        setStatus({ type: 'success', msg: 'Project updated successfully!' });
      } else {
        // حالة الإضافة الجديدة
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        
        if (error) throw error;
        setStatus({ type: 'success', msg: 'New project created!' });
      }

      setIsEditing(false);
      setFormData({id:'', title:'', description:'', image_url: '', live_link:'', github_link:'', category:'React'});
      fetchProjects();
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Error saving project' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
          .from('projects')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        fetchProjects();
        setStatus({ type: 'success', msg: 'Project deleted' });
      } catch (err) {
        setStatus({ type: 'error', msg: 'Delete failed' });
      } finally {
        setTimeout(() => setStatus(null), 3000);
      }
    }
  };

  if (loading && projects.length === 0) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <RefreshCw className="animate-spin text-[#8750f7]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 p-6 md:p-12 font-sans" dir="ltr">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0b0f13] p-8 rounded-3xl border border-gray-800 shadow-xl">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Project Portfolio <span className="text-[#8750f7]">.</span></h2>
            <p className="text-gray-500 mt-1">Showcase your best work to the world</p>
          </div>
          {!isEditing && (
            <button 
              onClick={() => {
                setFormData({id:'', title:'', description:'', image_url: '', live_link:'', github_link:'', category:'React'});
                setIsEditing(true);
              }} 
              className="bg-[#8750f7] hover:bg-[#6b3be6] px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#8750f7]/20"
            >
              <Plus size={20}/> Add New Project
            </button>
          )}
        </div>

        {status && (
          <div className={`p-4 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in duration-300 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            <CheckCircle2 size={18}/> {status.msg}
          </div>
        )}

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-[#0b0f13] rounded-3xl border border-dashed border-gray-800 text-gray-500">
                No projects found. Click "Add New Project" to start.
              </div>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="bg-[#0b0f13] border border-gray-800 rounded-3xl overflow-hidden group hover:border-[#8750f7]/50 transition-all duration-300">
                  <div className="h-48 bg-gray-900 relative overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700"><ImageIcon size={40}/></div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#8750f7] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                        {p.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h4 className="font-bold text-xl text-white truncate">{p.title}</h4>
                    <p className="text-gray-500 text-sm line-clamp-2 h-10">{p.description}</p>
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => {setFormData(p); setIsEditing(true);}} 
                        className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-[#8750f7] py-2.5 rounded-xl text-sm font-bold transition-all border border-white/5"
                      >
                        <Edit3 size={16}/> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 rounded-xl transition-all border border-red-500/10"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0b0f13] p-10 rounded-3xl border border-[#8750f7]/30 space-y-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center border-b border-gray-800 pb-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Layers className="text-[#8750f7]"/>
                    {formData.id ? 'Modify Project' : 'Project Details'}
                </h3>
                <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white transition-colors"><X/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Project Title</label>
                <input 
                    className="w-full bg-black/50 border border-gray-800 p-4 rounded-2xl focus:border-[#8750f7] outline-none transition-all text-white" 
                    placeholder="e.g. E-Commerce Platform"
                    value={formData.title} 
                    onChange={(e)=>setFormData({...formData, title: e.target.value})} 
                    required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tech Category</label>
                <select 
                    className="w-full bg-black/50 border border-gray-800 p-4 rounded-2xl focus:border-[#8750f7] outline-none appearance-none cursor-pointer text-white" 
                    value={formData.category} 
                    onChange={(e)=>setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
              <textarea 
                className="w-full bg-black/50 border border-gray-800 p-4 rounded-2xl h-32 focus:border-[#8750f7] outline-none transition-all resize-none text-white" 
                placeholder="Talk about the problem you solved..."
                value={formData.description} 
                onChange={(e)=>setFormData({...formData, description: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cover Image</label>
              <div className="flex flex-col md:flex-row gap-6 items-center bg-black/30 p-6 rounded-2xl border border-dashed border-gray-800">
                <div className="flex-1 w-full">
                    <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-800 rounded-2xl cursor-pointer hover:border-[#8750f7] hover:bg-[#8750f7]/5 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className={`mb-2 ${uploading ? 'animate-bounce text-[#8750f7]' : 'text-gray-500'}`} />
                            <p className="text-sm text-gray-500 font-medium">{uploading ? 'Uploading...' : 'Click to upload project thumbnail'}</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                </div>
                {formData.image_url && (
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-[#8750f7]/50 shadow-lg shadow-[#8750f7]/10">
                        <img src={formData.image_url} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                <input className="w-full bg-black/50 border border-gray-800 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-[#8750f7] text-white" placeholder="Live Preview URL" value={formData.live_link} onChange={(e)=>setFormData({...formData, live_link: e.target.value})} />
              </div>
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                <input className="w-full bg-black/50 border border-gray-800 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-[#8750f7] text-white" placeholder="GitHub Repository URL" value={formData.github_link} onChange={(e)=>setFormData({...formData, github_link: e.target.value})} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                type="submit" 
                disabled={uploading || loading} 
                className="flex-1 bg-[#8750f7] py-4 rounded-2xl font-bold hover:bg-[#6b3be6] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8750f7]/20 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={20}/> : <Save size={20}/>}
                {formData.id ? 'Update Project' : 'Save Project'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold transition-all border border-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}