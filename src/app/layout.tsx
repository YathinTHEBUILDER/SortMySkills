import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SortMySkills — Career Intelligence & Skill-Gap Analysis",
  description:
    "Structured career platform: skill normalization, gap analysis, Coursera roadmaps, and SkillQore interview question packs.",
};

const themeInitScript = `
(function() {
  try {
    var mode = localStorage.getItem('sortmyskills-theme-mode');
    var pack = localStorage.getItem('sortmyskills-color-pack') || 'terracotta';
    var packs = { terracotta: ['#c45b37','#d9b48f'], neon: ['#3be87e','#1ad1d7'], amber: ['#d4a017','#b87333'], slate: ['#7eb8c9','#c4cdd5'] };
    var colors = packs[pack] || packs.terracotta;
    document.documentElement.classList.add(mode === 'light' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-color-pack', pack);
    document.documentElement.style.setProperty('--accent-primary', colors[0]);
    document.documentElement.style.setProperty('--accent-secondary', colors[1]);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg-warm text-text-primary selection:bg-accent-green/20 selection:text-accent-green`}
      >
        <ThemeProvider>
          <AuthProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
