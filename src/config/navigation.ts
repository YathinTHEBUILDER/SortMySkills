import {
  BookOpen,
  Briefcase,
  Languages,
  LayoutDashboard,
  ScanSearch,
  MailX,
  User,
} from "lucide-react";

export const mainNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/job-match", label: "Job match", icon: Briefcase },
  { href: "/tools/parser", label: "Skill parser", icon: ScanSearch },
  { href: "/jd-translator", label: "JD Translator", icon: Languages },
  { href: "/why-no-reply", label: "Why No Reply", icon: MailX },
  { href: "/interview-packs", label: "Interview packs", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
] as const;
