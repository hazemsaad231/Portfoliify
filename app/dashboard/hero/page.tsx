'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { 
   Save, RefreshCw, User, 
  BarChart3, Link as LinkIcon, FileText, 
  CheckCircle2, AlertCircle, Github, Linkedin, Edit3, UploadCloud, PhoneCall
} from 'lucide-react';

const PLACEHOLDER_DATA = {
  small_name: 'HS',
  full_name: 'Your Full Name',
  job_title: 'Software Engineer / Designer',
  mini_bio: 'I am a professional developer specialized in building modern web applications.',
  exp_years: 0,
  projects_completed: 0,
  linkedin_url: '',
  github_url: '',
  whatsapp_url: '',
  cv_url: ''
};

export default function HeroDashboard() {
  const [data, setData] = useState<any>(PLACEHOLDER_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  
  // حالات توليد اللينكات
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userLinks, setUserLinks] = useState({ portfolio: '', dashboard: '' });

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

    // Validation: Small Name must be exactly 2 Capital Letters
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
      setIsNew(false);
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <RefreshCw className="animate-spin text-[#8750f7]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 p-4 md:p-10 font-sans" dir="ltr">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-gray-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Hero Manager <span className="text-[#8750f7]">.</span></h1>
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
              className={`${isEditing ? 'bg-[#8750f7] hover:bg-[#6b3be6]' : 'bg-white/10 hover:bg-white/20'} text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#8750f7]/10`}
            >
              {saving ? <RefreshCw className="animate-spin" size={20}/> : (isEditing ? <Save size={20}/> : <Edit3 size={20}/>)}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-[#8750f7]"><User size={24}/><h2 className="text-xl font-bold text-white">Personal Information</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Full Name</label>
                  <input disabled={!isEditing} className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none text-white" value={data.full_name} onChange={e => setData({...data, full_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Small Name (2 Letters)</label>
                  <input 
                    disabled={!isEditing} 
                    maxLength={2}
                    placeholder="HS"
                    className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none text-white uppercase" 
                    value={data.small_name} 
                    onChange={e => setData({...data, small_name: e.target.value.toUpperCase().replace(/[^A-Z]/g, '')})} 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Job Title</label>
                  <input disabled={!isEditing} className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none text-white" value={data.job_title} onChange={e => setData({...data, job_title: e.target.value})} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Mini Bio</label>
                  <textarea disabled={!isEditing} rows={4} className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none resize-none text-white" value={data.mini_bio} onChange={e => setData({...data, mini_bio: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-6 text-[#8750f7]"><BarChart3 size={24}/><h2 className="text-xl font-bold text-white">Statistics</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/20 p-4 rounded-2xl border border-gray-800/50">
                  <label className="text-xs font-bold text-gray-500 block mb-2">Years of Experience</label>
                  <input disabled={!isEditing} type="number" className="w-full bg-transparent text-3xl font-bold text-[#8750f7] outline-none" value={data.exp_years} onChange={e => setData({...data, exp_years: parseInt(e.target.value) || 0})} />
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-gray-800/50">
                  <label className="text-xs font-bold text-gray-500 block mb-2">Projects Completed</label>
                  <input disabled={!isEditing} type="number" className="w-full bg-transparent text-3xl font-bold text-[#8750f7] outline-none" value={data.projects_completed} onChange={e => setData({...data, projects_completed: parseInt(e.target.value) || 0})} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl h-full">
              <div className="flex items-center gap-3 mb-8 text-[#8750f7]"><LinkIcon size={24}/><h2 className="text-xl font-bold text-white">Links & Assets</h2></div>
              <div className="space-y-6">
                <div><label className="text-xs text-gray-500 font-bold block mb-2">LinkedIn</label><input disabled={!isEditing} className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-sm text-white" value={data.linkedin_url} onChange={e => setData({...data, linkedin_url: e.target.value})} /></div>
                <div><label className="text-xs text-gray-500 font-bold block mb-2">GitHub</label><input disabled={!isEditing} className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-sm text-white" value={data.github_url} onChange={e => setData({...data, github_url: e.target.value})} /></div>
                <div><label className="text-xs text-gray-500 font-bold block mb-2">WhatsApp</label><input disabled={!isEditing} className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-sm text-white" value={data.whatsapp_url} onChange={e => setData({...data, whatsapp_url: e.target.value})} /></div>
                <div className="pt-4 border-t border-gray-800">
                  <label className="text-xs text-gray-500 font-bold block mb-4">Resume (CV)</label>
                  {isEditing ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-800 rounded-2xl cursor-pointer bg-black/20 hover:border-[#8750f7]">
                      <UploadCloud className="text-gray-500 mb-2" /><input type="file" className="hidden" onChange={handleFileUpload} /><span className="text-xs text-gray-500">Upload PDF</span>
                    </label>
                  ) : (
                    data.cv_url && <a href={data.cv_url} target="_blank" className="block w-full text-center py-3 rounded-xl bg-[#8750f7]/10 text-[#8750f7] font-bold text-sm">View Current CV</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0b0f13] border border-[#8750f7]/50 w-full max-w-lg p-8 rounded-4xl shadow-2xl relative">
              <button onClick={() => setShowSuccessModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">✕</button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} /></div>
                <h2 className="text-2xl font-bold text-white">Portfolio Live!</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-gray-500 font-bold">Portfolio Link</label>
                  <div className="flex gap-2 bg-black/40 border border-gray-800 p-2 rounded-2xl">
                    <input readOnly value={userLinks.portfolio} className="bg-transparent flex-1 px-3 py-2 text-sm text-gray-300 outline-none" />
                    <button onClick={() => {navigator.clipboard.writeText(userLinks.portfolio); alert("Copied!")}} className="bg-[#8750f7] text-white px-4 py-2 rounded-xl text-xs font-bold">Copy</button>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowSuccessModal(false)} className="w-full mt-8 py-4 bg-white/5 text-white rounded-2xl font-bold">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}