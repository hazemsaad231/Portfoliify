

'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { ExternalLink, Copy, LayoutDashboard, User, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PortfolioLinksPage() {
    const [links, setLinks] = useState({ portfolio: '', dashboard: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLinks = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    const origin = window.location.origin;
                    setLinks({
                        portfolio: `${origin}/${profile.username}`,
                        dashboard: `${origin}/dashboard/hero`
                    });
                }
            }
            setLoading(false);
        };
        getLinks();
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Link copied to clipboard!");
    };

if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <RefreshCw className="animate-spin text-[#8750f7]" size={40} />
    </div>
  );

    return (
        <div className="min-h-screen flex items-center justify-center p-2 md:p-6">
            <div className="max-w-lg bg-[#0b0f13] border border-gray-800 p-4 md:p-6 rounded-[2.5rem] shadow-2xl">
                <h1 className="text-xl md:text-2xl font-bold text-white mb-8 text-center">Your Links <span className="text-[#8750f7]">.</span></h1>

                <div className="space-y-6">
                    {/* Portfolio Link */}
                    <div className="p-2 md:p-6 bg-black/40 border border-gray-800 rounded-3xl group hover:border-[#8750f7]/50 transition-all">
                        <div className="flex items-center gap-3 mb-4 text-[#8750f7]">
                            <User size={20} />
                            <span className="text-sm font-bold uppercase tracking-widest">Public Portfolio</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/60 p-2 rounded-2xl border border-gray-800">
                            <input readOnly value={links.portfolio} className="bg-transparent w-40 md:w-full text-sm text-gray-400 outline-none overflow-hidden text-ellipsis" />
                            <button onClick={() => copyToClipboard(links.portfolio)} className="p-2 hover:bg-[#8750f7]/20 rounded-lg text-gray-400 hover:text-[#8750f7] transition-all">
                                <Copy size={18} />
                            </button>
                            <a href={links.portfolio} target="_blank" className="p-2 hover:bg-[#8750f7]/20 rounded-lg text-gray-400 hover:text-[#8750f7] transition-all">
                                <ExternalLink size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Dashboard Link */}
                    <div className="p-2 md:p-6 bg-black/40 border border-gray-800 rounded-3xl group hover:border-[#8750f7]/50 transition-all">
                        <div className="flex items-center gap-3 mb-4 text-[#8750f7]">
                            <LayoutDashboard size={20} />
                            <span className="text-sm font-bold uppercase tracking-widest">Admin Dashboard</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/60 p-2 rounded-2xl border border-gray-800">
                            <input readOnly value={links.dashboard} className="bg-transparent w-40 md:w-full text-sm text-gray-400 outline-none overflow-hidden text-ellipsis" />
                            <button onClick={() => copyToClipboard(links.dashboard)} className="p-2 hover:bg-[#8750f7]/20 rounded-lg text-gray-400 hover:text-[#8750f7] transition-all">
                                <Copy size={18} />
                            </button>
                            <Link href="/dashboard/hero" className="p-2 hover:bg-[#8750f7]/20 rounded-lg text-gray-400 hover:text-[#8750f7] transition-all">
                                <ExternalLink size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-600 text-xs mt-8">
                    Share your portfolio link with your clients or recruiters!
                </p>
            </div>
        </div>
    );
}