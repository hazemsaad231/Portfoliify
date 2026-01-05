// import NavBar from "../Components/Navbar/navbar";
// import About from "../Components/About/about";
// import Contact from "../Components/Contact/contact";
// import Experience from "../Components/Experience/experience";
// import Hero from "../Components/Hero/hero";
// import Projects from "../Components/Projects/projects";

// export default function Home() {
//   return (
//     <div  className="app">
//       <NavBar />
//       <Hero />
//       <About />
//       <Experience />
//       <Projects />
//       <Contact />
//     </div>
//   );
// }



import NavBar from "./../Components/Navbar/navbar";
import About from "./../Components/About/about";
import Contact from "./../Components/Contact/contact";
import Experience from "./../Components/Experience/experience";
import Hero from "./../Components/Hero/hero";
import Projects from "./../Components/Projects/projects";
import { supabase } from "./../utils/supabase";
import { notFound } from "next/navigation";

// في النسخ الحديثة، params هي Promise
export default async function UserProfile({ params }: { params: Promise<{ username: string }> }) {
  
  // 1. انتظار الـ params للحصول على القيم بداخلها
  const resolvedParams = await params;
  const username = resolvedParams?.username;

  // 2. التحقق من وجود الاسم لتجنب خطأ undefined
  if (!username) {
    return notFound();
  }

  // 3. البحث في جدول profiles (تأكد أن الجدول والعمود موجودين بنفس الاسم)
  const { data: userProfile, error } = await supabase
    .from('profiles') 
    .select('id, username, full_name')
    .eq('username', username.toLowerCase())
    .single();

  // إذا حدث خطأ أو لم نجد المستخدم
  if (error || !userProfile) {
    return notFound();
  }

  const userId = userProfile.id;

  return (
    <div className="app">
      <NavBar userId={userId} />
      {/* تمرير الـ userId لكل مكون ليجلب بياناته الخاصة من الجداول الأخرى */}
      <Hero userId={userId} />
      <About userId={userId} />
      <Experience userId={userId} />
      <Projects userId={userId} />
      <Contact userId={userId} />
    </div>
  );
}