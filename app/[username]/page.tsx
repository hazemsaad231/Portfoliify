import NavBar from "./../Components/Navbar/navbar";
import About from "./../Components/About/about";
import Contact from "./../Components/Contact/contact";
import Experience from "./../Components/Experience/experience";
import Hero from "./../Components/Hero/hero";
import Projects from "./../Components/Projects/projects";
import { supabase } from "./../utils/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// 1. إضافة دالة Metadata الديناميكية
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams?.username;

  // جلب البيانات من جدول profiles وجدول hero معاً
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username?.toLowerCase())
    .single();

  if (profile) {
    const { data: hero } = await supabase
      .from('hero')
      .select('full_name, job_title, small_name')
      .eq('user_id', profile.id)
      .single();

    if (hero) {
      return {
        // العنوان الذي سيظهر في تابة المتصفح
        title: `${hero.full_name} | ${hero.job_title}`, 
        description: `Professional Portfolio of ${hero.full_name}`,
        // هنا نجعل اللوجو (Favicon) هو الـ Small Name إذا أردت أو لوجو ثابت
        icons: {
          icon: '/logo.png', // يمكنك استبدالها برابط صورة من الـ storage لو متوفرة
        },
        openGraph: {
          title: hero.full_name,
          description: hero.job_title,
          type: 'website',
        }
      };
    }
  }

  return { title: "Portfolio" };
}

// 2. الكود الأساسي للصفحة (UserProfile) كما هو مع تحسين بسيط
export default async function UserProfile({ params }: { params: Promise<{ username: string }> }) {
  
  const resolvedParams = await params;
  const username = resolvedParams?.username;

  if (!username) return notFound();

  const { data: userProfile, error } = await supabase
    .from('profiles') 
    .select('id, username')
    .eq('username', username.toLowerCase())
    .single();

  if (error || !userProfile) return notFound();

  const userId = userProfile.id;

  return (
    <div className="app min-h-screen selection:bg-[#8750f7]/30">
      <NavBar userId={userId} />
      <Hero userId={userId} />
      <About userId={userId} />
      <Experience userId={userId} />
      <Projects userId={userId} />
      <Contact userId={userId} />
    </div>
  );
}