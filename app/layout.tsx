import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// إبقاء الرندرة ديناميكية لضمان تحديث الاسم فوراً عند تعديله في الداشبورد

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {


    const userName = 'Portfolio';

    return {
      title: {
        default: `${userName}`,
        template: `%s | ${userName}`,
      },
      icons: {
        icon: '/logo.png', 
      },
    };
  } catch (error) {
    return {
      title: 'Portfolio',
      icons: { icon: '/logo.png' }
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}