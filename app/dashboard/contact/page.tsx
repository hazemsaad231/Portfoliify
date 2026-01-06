'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { 
  RefreshCw, Mail, Phone, Linkedin, 
  Github, MessageCircle, Save, X, Edit3, 
  CheckCircle2, Info 
} from 'lucide-react';

export default function ContactAdmin() {
  const [formData, setFormData] = useState({
    id: '', 
    email: '',
    phone: '',
    whatsapp: '',
    linkedin_url: '',
    github_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetchContact();
  }, []);

  async function fetchContact() {
    setLoading(true);
    try {
      // 1. جلب بيانات المستخدم المسجل حالياً
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. جلب معلومات التواصل المرتبطة بهذا الـ user_id فقط
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setFormData({
          id: data.id,
          email: data.email || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || ''
        });
      }
    } catch (err) {
      console.log("Error fetching contact info.");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      // تجهيز البيانات مع ربطها بالـ user_id
      const payload = {
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        linkedin_url: formData.linkedin_url || '',
        github_url: formData.github_url || '',
        user_id: user.id
      };

      // استخدام upsert للتحديث إذا كان السجل موجوداً أو إنشائه إذا لم يوجد بناءً على user_id
      const { error } = await supabase
        .from('contact_info')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) throw error;

      setStatus({ type: 'success', msg: 'Contact info saved successfully!' });
      setIsEditing(false);
      fetchContact(); // إعادة جلب البيانات لتحديث الحالة
    } catch (error: any) {
      setStatus({ type: 'error', msg: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  if (loading && !isEditing) return (
    <div className="min-h-screen flex items-center justify-center">
      <RefreshCw className="animate-spin text-[#8750f7]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-12" dir="ltr">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-[#0b0f13] p-8 rounded-3xl border border-gray-800 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="bg-[#8750f7]/10 p-3 rounded-2xl">
              <Info className="text-[#8750f7]" size={28} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Contact Channels <span className="text-[#8750f7]">.</span></h2>
              <p className="text-gray-500 text-sm">Update your public contact methods</p>
            </div>
          </div>
          
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-[#8750f7] hover:bg-[#6b3be6] px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#8750f7]/20 text-white"
            >
              <Edit3 size={18}/> {formData.id ? 'Edit Information' : 'Setup Contacts'}
            </button>
          )}
        </div>

        {status && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in duration-300 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            <CheckCircle2 size={18}/> {status.msg}
          </div>
        )}

        {/* View Mode */}
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContactCard icon={<Mail size={20}/>} label="Email Address" value={formData.email} />
            <ContactCard icon={<Phone size={20}/>} label="Phone Number" value={formData.phone} />
            <ContactCard icon={<MessageCircle size={20}/>} label="WhatsApp" value={formData.whatsapp} />
            <ContactCard icon={<Linkedin size={20}/>} label="LinkedIn Profile" value={formData.linkedin_url} isLink />
            <ContactCard icon={<Github size={20}/>} label="GitHub Profile" value={formData.github_url} isLink />
          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSubmit} className="bg-[#0b0f13] p-8 rounded-3xl border border-[#8750f7]/30 space-y-6 shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
                  <input 
                    type="email" 
                    className="w-full p-4 pl-12 bg-black border border-gray-800 rounded-2xl outline-none focus:border-[#8750f7] transition-all text-white"
                    placeholder="yourname@example.com"
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
                    <input 
                      type="text" 
                      className="w-full p-4 pl-12 bg-black border border-gray-800 rounded-2xl outline-none focus:border-[#8750f7] transition-all text-white"
                      placeholder="+20 123 456 789"
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">WhatsApp Number</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
                    <input 
                      type="text" 
                      className="w-full p-4 pl-12 bg-black border border-gray-800 rounded-2xl outline-none focus:border-[#8750f7] transition-all text-white"
                      placeholder="+20 123 456 789"
                      value={formData.whatsapp} 
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">LinkedIn URL</label>
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
                  <input 
                    type="url" 
                    className="w-full p-4 pl-12 bg-black border border-gray-800 rounded-2xl outline-none focus:border-[#8750f7] transition-all text-white"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin_url} 
                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">GitHub URL</label>
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
                  <input 
                    type="url" 
                    className="w-full p-4 pl-12 bg-black border border-gray-800 rounded-2xl outline-none focus:border-[#8750f7] transition-all text-white"
                    placeholder="https://github.com/username"
                    value={formData.github_url} 
                    onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                type="submit" disabled={loading}
                className="flex-1 bg-[#8750f7] py-4 rounded-2xl font-bold hover:bg-[#6b3be6] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8750f7]/20 disabled:opacity-50 text-white"
              >
                {loading ? <RefreshCw className="animate-spin" size={20}/> : <Save size={20}/>}
                Save Information
              </button>
              <button 
                type="button" onClick={() => setIsEditing(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold text-white transition-all border border-white/5 flex items-center justify-center gap-2"
              >
                <X size={20}/> Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ContactCard({ icon, label, value, isLink = false }: any) {
  return (
    <div className="p-6 bg-[#0b0f13] rounded-2xl border border-gray-800 hover:border-[#8750f7]/40 transition-all group">
      <div className="flex items-center gap-3 text-gray-500 mb-2">
        <div className="text-[#8750f7] group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className={`font-medium ${isLink && value ? 'text-[#8750f7] underline underline-offset-4' : 'text-white'} truncate`}>
        {value || `No ${label} added`}
      </p>
    </div>
  );
}