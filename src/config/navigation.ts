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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/job-match", label: "Job Match", icon: Briefcase },
  { href: "/tools/parser", label: "Skill Parser", icon: ScanSearch },
  { href: "/jd-translator", label: "JD Breakdown", icon: Languages },
  { href: "/why-no-reply", label: "Why No Reply", icon: MailX },
  { href: "/interview-packs", label: "Interview Prep", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
] as const;
