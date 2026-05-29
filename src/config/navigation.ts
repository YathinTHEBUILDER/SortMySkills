import {
  BookOpen,
  LayoutDashboard,
  ScanSearch,
  MailX,
  User,
  FileText,
} from "lucide-react";

export const mainNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/why-no-reply", label: "Why No Reply", icon: MailX },
  { href: "/career-analyser", label: "Career Analyser", icon: ScanSearch },
  { href: "/resume-builder", label: "Resume Builder", icon: FileText },
  { href: "/interview-packs", label: "Interview Packs", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
] as const;

