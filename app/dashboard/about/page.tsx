'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Save, Plus, Trash2, RefreshCw, GraduationCap, Code, FileText, Edit3, CheckCircle2 } from 'lucide-react';

export default function AboutDashboard() {
  const [data, setData] = useState<any>({
    about_me_long: '',
    skills: [],
    education: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profile_all')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setData({
          ...profile,
          skills: profile.skills || [],
          education: profile.education || []
        });
      }
    } catch (err) {
      console.error("Error fetching about data:", err);
    } finally {
      setLoading(false);
    }
  };

  // وظائف المهارات
  const addSkill = () => {
    if (!isEditing || !newSkill.trim()) return;
    setData({ ...data, skills: [...(data.skills || []), newSkill.trim()] });
    setNewSkill('');
  };

  const removeSkill = (index: number) => {
    if (!isEditing) return;
    const updatedSkills = data.skills.filter((_: any, i: number) => i !== index);
    setData({ ...data, skills: updatedSkills });
  };

  // وظائف التعليم
  const addEducation = () => {
    if (!isEditing) return;
    const newEdu = { degree: '', university: '', duration: '' };
    setData({ ...data, education: [...(data.education || []), newEdu] });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    if (!isEditing) return;
    const updatedEdu = [...data.education];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    setData({ ...data, education: updatedEdu });
  };

  const removeEducation = (index: number) => {
    if (!isEditing) return;
    const updatedEdu = data.education.filter((_: any, i: number) => i !== index);
    setData({ ...data, education: updatedEdu });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const payload = {
        user_id: user.id,
        about_me_long: data.about_me_long,
        skills: data.skills,
        education: data.education
      };

      const { error } = await supabase
        .from('profile_all')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) throw error;

      setStatus({ type: 'success', msg: 'Profile updated successfully! 🎉' });
      setIsEditing(false);
      fetchData();
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Failed to update' });
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
    <div className="min-h-screen text-white p-6 md:p-12 font-sans" dir="ltr">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-white">About Manager <span className="text-[#8750f7]">.</span></h1>
            <p className="text-gray-500 text-sm mt-1">
              {isEditing ? "Editing your professional profile" : "View mode"}
            </p>
          </div>
          
          <div className="flex gap-4">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all border border-white/10 text-white"
              >
                <Edit3 size={18}/> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                 <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-red-500/10 text-red-500 px-4 py-3 rounded-xl font-bold transition-all border border-red-500/20"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#8750f7] hover:bg-[#6b3be6] px-8 py-3 rounded-xl flex items-center gap-2 font-bold transition-all disabled:opacity-50 text-white"
                >
                  {saving ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
                  Update Data
                </button>
              </div>
            )}
          </div>
        </div>

        {status && (
          <div className={`p-4 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            <CheckCircle2 size={18}/> {status.msg}
          </div>
        )}

        {/* 1. Long Bio */}
        <section className={`bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl transition-all ${isEditing ? 'border-[#8750f7]/40 shadow-lg shadow-[#8750f7]/5' : ''}`}>
          <div className="flex items-center gap-3 mb-6 text-[#8750f7]">
            <FileText size={24}/>
            <h2 className="text-xl font-bold text-white">Biography</h2>
          </div>
          <textarea 
            readOnly={!isEditing}
            rows={6}
            className={`w-full bg-black/40 border border-gray-800 rounded-2xl p-4 outline-none transition-all resize-none text-white ${isEditing ? 'focus:border-[#8750f7] border-gray-700' : 'cursor-default opacity-70'}`}
            placeholder="Write a long description about your career..."
            value={data.about_me_long}
            onChange={(e) => setData({...data, about_me_long: e.target.value})}
          />
        </section>

        {/* 2. Skills */}
        <section className={`bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl transition-all ${isEditing ? 'border-[#8750f7]/40 shadow-lg shadow-[#8750f7]/5' : ''}`}>
          <div className="flex items-center gap-3 mb-6 text-[#8750f7]">
            <Code size={24}/>
            <h2 className="text-xl font-bold text-white">Skills</h2>
          </div>
          
          {isEditing && (
            <div className="flex gap-2 mb-6">
              <input 
                type="text"
                className="flex-1 bg-black/40 border border-gray-800 rounded-xl p-3 focus:border-[#8750f7] outline-none text-white"
                placeholder="Add skill (e.g. Next.js)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <button onClick={addSkill} className="bg-[#8750f7] p-3 rounded-xl text-white"><Plus/></button>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {data.skills?.length > 0 ? data.skills.map((skill: string, index: number) => (
              <div key={index} className="bg-black/40 border border-[#8750f7]/30 px-4 py-2 rounded-full flex items-center gap-2 group transition-all hover:border-[#8750f7]">
                <span className="text-gray-200">{skill}</span>
                {isEditing && (
                  <button onClick={() => removeSkill(index)} className="text-red-500 hover:text-red-400 ml-1">
                    <Trash2 size={14}/>
                  </button>
                )}
              </div>
            )) : <p className="text-gray-600 italic">No skills added yet.</p>}
          </div>
        </section>

        {/* 3. Education History */}
        <section className={`bg-[#0b0f13] border border-gray-800 p-8 rounded-3xl transition-all ${isEditing ? 'border-[#8750f7]/40 shadow-lg shadow-[#8750f7]/5' : ''}`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3 text-[#8750f7]">
              <GraduationCap size={24}/>
              <h2 className="text-xl font-bold text-white">Education History</h2>
            </div>
            {isEditing && (
              <button onClick={addEducation} className="text-sm bg-[#8750f7]/10 text-[#8750f7] hover:bg-[#8750f7]/20 px-4 py-2 rounded-lg transition-all flex items-center gap-2 border border-[#8750f7]/20">
                <Plus size={16}/> Add Education
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {data.education?.length > 0 ? data.education.map((edu: any, index: number) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/40 p-5 rounded-2xl border border-gray-800 relative group">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">Degree</label>
                  <input 
                    readOnly={!isEditing}
                    placeholder="e.g. B.Sc Computer Science"
                    className={`w-full bg-transparent border-b border-gray-800 p-2 outline-none text-white ${isEditing ? 'focus:border-[#8750f7] border-gray-700' : 'cursor-default'}`}
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">University</label>
                  <input 
                    readOnly={!isEditing}
                    placeholder="e.g. Cairo University"
                    className={`w-full bg-transparent border-b border-gray-800 p-2 outline-none text-white ${isEditing ? 'focus:border-[#8750f7] border-gray-700' : 'cursor-default'}`}
                    value={edu.university}
                    onChange={(e) => updateEducation(index, 'university', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">Duration</label>
                  <div className="flex gap-2">
                    <input 
                      readOnly={!isEditing}
                      placeholder="e.g. 2018 - 2022"
                      className={`flex-1 bg-transparent border-b border-gray-800 p-2 outline-none text-white ${isEditing ? 'focus:border-[#8750f7] border-gray-700' : 'cursor-default'}`}
                      value={edu.duration}
                      onChange={(e) => updateEducation(index, 'duration', e.target.value)}
                    />
                    {isEditing && (
                      <button onClick={() => removeEducation(index)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={18}/>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )) : <p className="text-gray-600 italic">No education history added.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}