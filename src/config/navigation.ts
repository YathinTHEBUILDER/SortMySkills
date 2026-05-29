import {
  BookOpen,
  Briefcase,
  Compass,
  LayoutDashboard,
  ScanSearch,
} from "lucide-react";

export const mainNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/skill-development", label: "Skill planner", icon: Compass },
  { href: "/job-match", label: "Job match", icon: Briefcase },
  { href: "/tools/parser", label: "Skill parser", icon: ScanSearch },
  { href: "/interview-packs", label: "Interview packs", icon: BookOpen },
] as const;
