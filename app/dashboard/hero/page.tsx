// 'use client';
// import { useState, useEffect } from 'react';
// import { supabase } from '../../utils/supabase';
// import { 
//   PlusCircle, Save, RefreshCw, User, 
//   BarChart3, Link as LinkIcon, FileText, 
//   CheckCircle2, AlertCircle, Github, Linkedin, Edit3, UploadCloud,PhoneCall
// } from 'lucide-react';

// export default function HeroDashboard() {
//   const [data, setData] = useState<any>({
//     small_name: '',
//     full_name: '',
//     job_title: '',
//     mini_bio: '',
//     exp_years: 0,
//     projects_completed: 0,
//     linkedin_url: '',
//     github_url: '',
//     whatsapp_url: '',
//     cv_url: ''
//   });
  
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [isNew, setIsNew] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       // 1. الحصول على المستخدم الحالي المسجل دخوله
//       const { data: { user } } = await supabase.auth.getUser();

//       if (user) {
//         // 2. جلب البيانات المرتبطة بهذا المستخدم فقط
//         const { data: heroData, error } = await supabase
//           .from('hero')
//           .select('*') 
//           .eq('user_id', user.id)
//           .maybeSingle(); // نبحث عن سجل واحد أو لا شيء (لو مستخدم جديد)

//         if (heroData) {
//           setData(heroData);
//           setIsNew(false);
//         } else {
//           setIsNew(true);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       setSaving(true);
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error("Please login first");

//       const fileExt = file.name.split('.').pop();
//       const fileName = `${Math.random()}.${fileExt}`;
//       // تنظيم الملفات في Storage بحيث يكون لكل مستخدم مجلده الخاص
//       const filePath = `cv/${user.id}/${fileName}`;

//       const { error: uploadError } = await supabase.storage
//         .from('documents')
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath);
      
//       setData({ ...data, cv_url: publicUrl });
//       setStatus({ type: 'success', msg: 'CV uploaded successfully!' });
//     } catch (error: any) {
//       setStatus({ type: 'error', msg: error.message });
//     } finally {
//       setSaving(false);
//       setTimeout(() => setStatus(null), 3000);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     setStatus(null);
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error("No authenticated user found");

//       // ربط البيانات بالـ user_id الحالي
//       const payload = {
//         ...data,
//         user_id: user.id
//       };

//       const { error } = await supabase
//         .from('hero')
//         .upsert(payload, { onConflict: 'user_id' }); // التحديث بناءً على الـ user_id
      
//       if (error) throw error;

//       setStatus({ type: 'success', msg: isNew ? 'Created successfully!' : 'Updated successfully!' });
//       setIsNew(false);
//       setIsEditing(false);
//       fetchData();
//     } catch (error: any) {
//       setStatus({ type: 'error', msg: error.message });
//     } finally {
//       setSaving(false);
//       setTimeout(() => setStatus(null), 3000);
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen bg-[#050505] flex items-center justify-center">
//       <RefreshCw className="animate-spin text-[#8750f7]" size={40} />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#050505] text-gray-200 p-4 md:p-10 font-sans" dir="ltr">
//       <div className="max-w-5xl mx-auto">
        
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-gray-800 pb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white tracking-tight">Hero Manager <span className="text-[#8750f7]">.</span></h1>
//             <p className="text-gray-500 mt-1">
//               {isEditing ? 'Editing your professional profile' : 'Viewing your profile information'}
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             {status && (
//               <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm animate-pulse ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
//                 {status.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
//                 {status.msg}
//               </div>
//             )}
            
//             {!isEditing ? (
//               <button 
//                 onClick={() => setIsEditing(true)}
//                 className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all border border-white/10"
//               >
//                 <Edit3 size={20}/> Edit Profile
//               </button>
//             ) : (
//               <button 
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="bg-[#8750f7] hover:bg-[#6b3be6] text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#8750f7]/20 disabled:opacity-50"
//               >
//                 {saving ? <RefreshCw className="animate-spin" size={20}/> : (isNew ? <PlusCircle size={20}/> : <Save size={20}/>)}
//                 {isNew ? 'Create Profile' : 'Save Changes'}
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* Main Info */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl shadow-sm">
//               <div className="flex items-center gap-3 mb-6 text-[#8750f7]">
//                 <User size={24}/>
//                 <h2 className="text-xl font-bold text-white">Personal Information</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Full Name</label>
//                   <input 
//                     disabled={!isEditing}
//                     placeholder="e.g. Hazem Mohamed"
//                     className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
//                     value={data?.full_name || ''} 
//                     onChange={e => setData({...data, full_name: e.target.value})}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Job Title</label>
//                   <input 
//                     disabled={!isEditing}
//                     placeholder="e.g. Frontend Developer"
//                     className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
//                     value={data?.job_title || ''} 
//                     onChange={e => setData({...data, job_title: e.target.value})}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Small Name</label>
//                   <input 
//                     disabled={!isEditing}
//                     placeholder="HM"
//                     className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
//                     value={data?.small_name || ''} 
//                     onChange={e => setData({...data, small_name: e.target.value})}
//                   />
//                 </div>
//                 <div className="md:col-span-2 space-y-2">
//                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Mini Bio</label>
//                   <textarea 
//                     disabled={!isEditing}
//                     rows={4}
//                     placeholder="Briefly describe yourself..."
//                     className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed text-white"
//                     value={data?.mini_bio || ''} 
//                     onChange={e => setData({...data, mini_bio: e.target.value})}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Statistics */}
//             <div className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl">
//               <div className="flex items-center gap-3 mb-6 text-[#8750f7]">
//                 <BarChart3 size={24}/>
//                 <h2 className="text-xl font-bold text-white">Statistics</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-black/20 p-4 rounded-2xl border border-gray-800/50 space-y-2">
//                   <label className="text-xs font-bold text-gray-500 block">Years of Experience</label>
//                   <input 
//                     disabled={!isEditing}
//                     type="number"
//                     className="w-full bg-transparent text-3xl font-bold text-[#8750f7] outline-none disabled:opacity-50"
//                     value={data?.exp_years || 0} 
//                     onChange={e => setData({...data, exp_years: parseInt(e.target.value) || 0})}
//                   />
//                 </div>
//                 <div className="bg-black/20 p-4 rounded-2xl border border-gray-800/50 space-y-2">
//                   <label className="text-xs font-bold text-gray-500 block">Projects Completed</label>
//                   <input 
//                     disabled={!isEditing}
//                     type="number"
//                     className="w-full bg-transparent text-3xl font-bold text-[#8750f7] outline-none disabled:opacity-50"
//                     value={data?.projects_completed || 0} 
//                     onChange={e => setData({...data, projects_completed: parseInt(e.target.value) || 0})}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Links & CV Section */}
//           <div className="space-y-6">
//             <div className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl h-full">
//               <div className="flex items-center gap-3 mb-8 text-[#8750f7]">
//                 <LinkIcon size={24}/>
//                 <h2 className="text-xl font-bold text-white">Links & Assets</h2>
//               </div>
              
//               <div className="space-y-6">
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
//                     <Linkedin size={16}/> LinkedIn URL
//                   </div>
//                   <input 
//                     disabled={!isEditing}
//                     className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-xs focus:border-[#8750f7] outline-none transition-all disabled:opacity-50 text-white"
//                     value={data?.linkedin_url || ''} 
//                     onChange={e => setData({...data, linkedin_url: e.target.value})}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
//                     <Github size={16}/> GitHub URL
//                   </div>
//                   <input 
//                     disabled={!isEditing}
//                     className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-xs focus:border-[#8750f7] outline-none transition-all disabled:opacity-50 text-white"
//                     value={data?.github_url || ''} 
//                     onChange={e => setData({...data, github_url: e.target.value})}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
//                     <PhoneCall size={16}/> WhatsApp
//                   </div>
//                   <input 
//                     disabled={!isEditing}
//                     className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-xs focus:border-[#8750f7] outline-none transition-all disabled:opacity-50 text-white"
//                     value={data?.whatsapp_url || ''} 
//                     onChange={e => setData({...data, whatsapp_url: e.target.value})}
//                   />
//                 </div>

//                 <div className="space-y-2 pt-4 border-t border-gray-800">
//                   <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
//                     <FileText size={16}/> Resume (CV)
//                   </div>
                  
//                   {isEditing ? (
//                     <div className="relative group">
//                       <input 
//                         type="file" 
//                         accept=".pdf,.doc,.docx"
//                         onChange={handleFileUpload}
//                         className="hidden" 
//                         id="cv-upload"
//                       />
//                       <label 
//                         htmlFor="cv-upload"
//                         className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-800 rounded-2xl cursor-pointer bg-black/20 hover:border-[#8750f7] transition-all"
//                       >
//                         <UploadCloud className={`mb-2 ${saving ? 'animate-bounce text-[#8750f7]' : 'text-gray-500'}`} />
//                         <span className="text-xs text-gray-500">{saving ? 'Uploading...' : 'Click to upload PDF'}</span>
//                       </label>
//                     </div>
//                   ) : (
//                     data.cv_url ? (
//                       <a 
//                         href={data.cv_url} 
//                         target="_blank" 
//                         rel="noreferrer"
//                         className="block w-full text-center py-3 rounded-xl bg-[#8750f7]/10 text-[#8750f7] border border-[#8750f7]/20 hover:bg-[#8750f7]/20 transition-all text-sm font-bold"
//                       >
//                         View Current CV
//                       </a>
//                     ) : (
//                       <p className="text-xs text-gray-600 text-center italic">No CV uploaded yet</p>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { 
  PlusCircle, Save, RefreshCw, User, 
  BarChart3, Link as LinkIcon, FileText, 
  CheckCircle2, AlertCircle, Github, Linkedin, Edit3, UploadCloud, PhoneCall
} from 'lucide-react';

// 1. تعريف البيانات الافتراضية بالإنجليزية
const PLACEHOLDER_DATA = {
  small_name: 'YOUR NAME',
  full_name: 'Your Full Name',
  job_title: 'Software Engineer / Designer',
  mini_bio: 'I am a professional developer specialized in building modern web applications. Passionate about turning ideas into reality.',
  exp_years: 0,
  projects_completed: 0,
  linkedin_url: 'https://linkedin.com/in/yourprofile',
  github_url: 'https://github.com/yourusername',
  whatsapp_url: 'https://wa.me/yournumber',
  cv_url: ''
};

export default function HeroDashboard() {
  // 2. تعيين الحالة الابتدائية بالبيانات الافتراضية
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
        const { data: heroData, error } = await supabase
          .from('hero')
          .select('*') 
          .eq('user_id', user.id)
          .maybeSingle();

        if (heroData) {
          setData(heroData);
          setIsNew(false);
        } else {
          // إذا كان المستخدم جديداً، نحافظ على الـ PLACEHOLDER_DATA
          setIsNew(true);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ... (نفس دالة handleFileUpload بدون تغيير)
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

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const payload = {
        ...data,
        user_id: user.id
      };

      const { error } = await supabase
        .from('hero')
        .upsert(payload, { onConflict: 'user_id' }); 
      
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
            <p className="text-gray-500 mt-1">
              {isEditing ? 'Editing your professional profile' : 'Viewing your profile information'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {status && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm animate-pulse ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {status.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                {status.msg}
              </div>
            )}
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all border border-white/10"
              >
                <Edit3 size={20}/> Edit Profile
              </button>
            ) : (
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-[#8750f7] hover:bg-[#6b3be6] text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#8750f7]/20 disabled:opacity-50"
              >
                {saving ? <RefreshCw className="animate-spin" size={20}/> : (isNew ? <PlusCircle size={20}/> : <Save size={20}/>)}
                {isNew ? 'Create Profile' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-[#8750f7]">
                <User size={24}/>
                <h2 className="text-xl font-bold text-white">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Full Name</label>
                  <input 
                    disabled={!isEditing}
                    placeholder={PLACEHOLDER_DATA.full_name}
                    className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    value={data.full_name} 
                    onChange={e => setData({...data, full_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Job Title</label>
                  <input 
                    disabled={!isEditing}
                    placeholder={PLACEHOLDER_DATA.job_title}
                    className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    value={data.job_title} 
                    onChange={e => setData({...data, job_title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Small Name (Initial)</label>
                  <input 
                    disabled={!isEditing}
                    placeholder={PLACEHOLDER_DATA.small_name}
                    className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white uppercase"
                    value={data.small_name} 
                    onChange={e => setData({...data, small_name: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Mini Bio</label>
                  <textarea 
                    disabled={!isEditing}
                    rows={4}
                    placeholder={PLACEHOLDER_DATA.mini_bio}
                    className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 focus:border-[#8750f7] outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    value={data.mini_bio} 
                    onChange={e => setData({...data, mini_bio: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Statistics Section (بقيت كما هي) */}
            <div className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-6 text-[#8750f7]">
                <BarChart3 size={24}/>
                <h2 className="text-xl font-bold text-white">Statistics</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/20 p-4 rounded-2xl border border-gray-800/50 space-y-2">
                  <label className="text-xs font-bold text-gray-500 block">Years of Experience</label>
                  <input 
                    disabled={!isEditing}
                    type="number"
                    className="w-full bg-transparent text-3xl font-bold text-[#8750f7] outline-none disabled:opacity-50"
                    value={data.exp_years} 
                    onChange={e => setData({...data, exp_years: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-gray-800/50 space-y-2">
                  <label className="text-xs font-bold text-gray-500 block">Projects Completed</label>
                  <input 
                    disabled={!isEditing}
                    type="number"
                    className="w-full bg-transparent text-3xl font-bold text-[#8750f7] outline-none disabled:opacity-50"
                    value={data.projects_completed} 
                    onChange={e => setData({...data, projects_completed: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Links & CV Section (تم تحسين الـ Placeholders) */}
          <div className="space-y-6">
            <div className="bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl h-full">
              <div className="flex items-center gap-3 mb-8 text-[#8750f7]">
                <LinkIcon size={24}/>
                <h2 className="text-xl font-bold text-white">Links & Assets</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Linkedin size={16}/> LinkedIn URL
                  </div>
                  <input 
                    disabled={!isEditing}
                    placeholder={PLACEHOLDER_DATA.linkedin_url}
                    className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-xs focus:border-[#8750f7] outline-none transition-all disabled:opacity-50 text-white"
                    value={data.linkedin_url} 
                    onChange={e => setData({...data, linkedin_url: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Github size={16}/> GitHub URL
                  </div>
                  <input 
                    disabled={!isEditing}
                    placeholder={PLACEHOLDER_DATA.github_url}
                    className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-xs focus:border-[#8750f7] outline-none transition-all disabled:opacity-50 text-white"
                    value={data.github_url} 
                    onChange={e => setData({...data, github_url: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <PhoneCall size={16}/> WhatsApp Number
                  </div>
                  <input 
                    disabled={!isEditing}
                    placeholder="+1234567890"
                    className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-xs focus:border-[#8750f7] outline-none transition-all disabled:opacity-50 text-white"
                    value={data.whatsapp_url} 
                    onChange={e => setData({...data, whatsapp_url: e.target.value})}
                  />
                </div>

                {/* CV Upload Section (بقيت كما هي) */}
                <div className="space-y-2 pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <FileText size={16}/> Resume (CV)
                  </div>
                  {isEditing ? (
                    <div className="relative group">
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" id="cv-upload" />
                      <label htmlFor="cv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-800 rounded-2xl cursor-pointer bg-black/20 hover:border-[#8750f7] transition-all">
                        <UploadCloud className={`mb-2 ${saving ? 'animate-bounce text-[#8750f7]' : 'text-gray-500'}`} />
                        <span className="text-xs text-gray-500">{saving ? 'Uploading...' : 'Click to upload PDF'}</span>
                      </label>
                    </div>
                  ) : (
                    data.cv_url ? (
                      <a href={data.cv_url} target="_blank" rel="noreferrer" className="block w-full text-center py-3 rounded-xl bg-[#8750f7]/10 text-[#8750f7] border border-[#8750f7]/20 hover:bg-[#8750f7]/20 transition-all text-sm font-bold">
                        View Current CV
                      </a>
                    ) : (
                      <p className="text-xs text-gray-600 text-center italic">No CV uploaded yet</p>
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