'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { 
  Save, RefreshCw, User, 
  BarChart3, Link as LinkIcon, 
  CheckCircle2, AlertCircle, Edit3, UploadCloud
} from 'lucide-react';

const PLACEHOLDER_DATA = {
  small_name: 'XX',
  first_name: 'Your First Name',
  last_name: 'Your Full Name',
  job_title: 'Your Job Title',
  mini_bio: 'A brief bio about you.',
  exp_years: 0,
  projects_completed: 0,
  linkedin_url: '',
  github_url: '',
  whatsapp_url: '',
  cv_url: '',
  logo_url: '' // الحقل الجديد للوجو
};

export default function HeroDashboard() {
  const [data, setData] = useState<any>(PLACEHOLDER_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: heroData } = await supabase
          .from('hero')
          .select('*') 
          .eq('user_id', user.id)
          .maybeSingle();

        if (heroData) {
          setData(heroData);
          setIsNew(false);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // دالة رفع اللوجو (الصورة الشخصية)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', msg: 'Please upload an image file' });
      return;
    }

    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login first");

      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath);
      
      setData({ ...data, logo_url: publicUrl });
      setStatus({ type: 'success', msg: 'Logo uploaded successfully!' });
    } catch (error: any) {
      setStatus({ type: 'error', msg: error.message });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  // دالة رفع الـ CV
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login first");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `cv/${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath);
      setData({ ...data, cv_url: publicUrl });
      setStatus({ type: 'success', msg: 'CV uploaded successfully!' });
    } catch (error: any) {
      setStatus({ type: 'error', msg: error.message });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);

    const smallNameRegex = /^[A-Z]{2}$/;
    if (!smallNameRegex.test(data.small_name)) {
      setStatus({ type: 'error', msg: 'Small Name must be 2 Capital Letters (e.g., HS)' });
      setSaving(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const payload = { ...data, user_id: user.id };
      const { error } = await supabase.from('hero').upsert(payload, { onConflict: 'user_id' }); 
      if (error) throw error;
      
      setStatus({ type: 'success', msg: isNew ? 'Created successfully!' : 'Updated successfully!' });
      setIsEditing(false);
      fetchData();
    } catch (error: any) {
      setStatus({ type: 'error', msg: error.message });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <RefreshCw className="animate-spin text-[#8750f7]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen text-gray-200 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4 border-b border-gray-800 pb-8">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">Hero Manager <span className="text-[#8750f7]">.</span></h1>
            <p className="text-gray-500 mt-1">{isEditing ? 'Editing your profile' : 'Viewing your profile'}</p>
          </div>
          <div className="flex items-center gap-4">
            {status && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {status.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                {status.msg}
              </div>
            )}
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={saving}
              className={`${isEditing ? 'bg-[#8750f7] hover:bg-[#6b3be6]' : 'bg-white/10 hover:bg-white/20'} text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg`}
            >
              {saving ? <RefreshCw className="animate-spin" size={20}/> : (isEditing ? <Save size={20}/> : <Edit3 size={20}/>)}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information & Logo */}
            <div className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-8 text-[#8750f7]">
                <User size={24}/><h2 className="text-xl font-bold text-white">Personal Information</h2>
              </div>
              
              <div className="flex flex-col md:flex-row gap-10">
                {/* Logo Upload Section */}
                <div className="flex flex-col items-center gap-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block text-center w-full">Logo / Avatar</label>
                  <div className="relative group w-32 h-32">
                    <div className="w-32 h-32 rounded-3xl bg-black/40 border-2 border-dashed border-gray-800 overflow-hidden flex items-center justify-center relative shadow-inner">
                      {data.logo_url ? (
                        <img src={data.logo_url} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[#8750f7] font-black text-3xl tracking-tighter">{data.small_name}</div>
                      )}
                      
                      {isEditing && (
                        <label className="absolute inset-0 bg-[#8750f7]/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                          <UploadCloud size={28} className="text-white mb-1" />
                          <span className="text-[10px] text-white font-black uppercase">Upload</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                      )}
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-600 text-center uppercase font-bold tracking-widest">Square Image Recommended</p>
                </div>

                {/* Form Inputs */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">First Name</label>
                    <input disabled={!isEditing} className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none text-white transition-all" value={data.first_name} onChange={e => setData({...data, first_name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Last Name</label>
                    <input disabled={!isEditing} className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none text-white transition-all" value={data.Last_name} onChange={e => setData({...data, Last_name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Small Name (2 Letters)</label>
                    <input 
                      disabled={!isEditing} 
                      maxLength={2}
                      placeholder="XX"
                      className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none text-white uppercase font-bold" 
                      value={data.small_name} 
                      onChange={e => setData({...data, small_name: e.target.value.toUpperCase().replace(/[^A-Z]/g, '')})} 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Job Title</label>
                    <input disabled={!isEditing} className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none text-white transition-all" value={data.job_title} onChange={e => setData({...data, job_title: e.target.value})} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Mini Bio</label>
                    <textarea disabled={!isEditing} rows={4} className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none resize-none text-white transition-all" value={data.mini_bio} onChange={e => setData({...data, mini_bio: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-6 text-[#8750f7]"><BarChart3 size={24}/><h2 className="text-xl font-bold text-white">Statistics</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/20 p-6 rounded-2xl border border-gray-800/50">
                  <label className="text-[10px] font-bold text-gray-500 block mb-2 uppercase tracking-widest">Years of Experience</label>
                  <input disabled={!isEditing} type="number" className="w-full bg-transparent text-4xl font-black text-[#8750f7] outline-none" value={data.exp_years} onChange={e => setData({...data, exp_years: parseInt(e.target.value) || 0})} />
                </div>
                <div className="bg-black/20 p-6 rounded-2xl border border-gray-800/50">
                  <label className="text-[10px] font-bold text-gray-500 block mb-2 uppercase tracking-widest">Projects Completed</label>
                  <input disabled={!isEditing} type="number" className="w-full bg-transparent text-4xl font-black text-[#8750f7] outline-none" value={data.projects_completed} onChange={e => setData({...data, projects_completed: parseInt(e.target.value) || 0})} />
                </div>
              </div>
            </div>
          </div>

          {/* Links & Assets Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl sticky top-10">
              <div className="flex items-center gap-3 mb-8 text-[#8750f7]"><LinkIcon size={24}/><h2 className="text-xl font-bold text-white">Links & Assets</h2></div>
              <div className="space-y-6">
                <div><label className="text-[10px] text-gray-500 font-bold block mb-2 uppercase tracking-widest">LinkedIn Profile</label><input disabled={!isEditing} placeholder="URL" className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-[#8750f7] outline-none" value={data.linkedin_url} onChange={e => setData({...data, linkedin_url: e.target.value})} /></div>
                <div><label className="text-[10px] text-gray-500 font-bold block mb-2 uppercase tracking-widest">GitHub Profile</label><input disabled={!isEditing} placeholder="URL" className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-[#8750f7] outline-none" value={data.github_url} onChange={e => setData({...data, github_url: e.target.value})} /></div>
                <div><label className="text-[10px] text-gray-500 font-bold block mb-2 uppercase tracking-widest">WhatsApp Number</label><input disabled={!isEditing} placeholder="Example: +201..." className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-[#8750f7] outline-none" value={data.whatsapp_url} onChange={e => setData({...data, whatsapp_url: e.target.value})} /></div>
                
                <div className="pt-6 border-t border-gray-800">
                  <label className="text-[10px] text-gray-500 font-bold block mb-4 uppercase tracking-widest">Resume (PDF)</label>
                  {isEditing ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-800 rounded-2xl cursor-pointer bg-black/20 hover:border-[#8750f7] transition-all group">
                      <UploadCloud className="text-gray-500 mb-2 group-hover:text-[#8750f7]" />
                      <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                      <span className="text-[10px] text-gray-500 font-bold">Upload New CV</span>
                    </label>
                  ) : (
                    data.cv_url && (
                      <a href={data.cv_url} target="_blank" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#8750f7]/10 text-[#8750f7] font-bold text-xs hover:bg-[#8750f7]/20 transition-all border border-[#8750f7]/20">
                        View Active CV
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}