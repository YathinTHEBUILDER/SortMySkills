import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth/get-user";
import { signOutAction } from "@/app/actions/auth";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  User,
  LogOut,
} from "lucide-react";

const tools = [
  {
    href: "/skill-development",
    title: "Skill planner",
    description: "Pick a role, audit skills, get a study roadmap.",
    icon: Compass,
  },
  {
    href: "/job-match",
    title: "Job match",
    description: "Paste resume and JD — see match % and gaps.",
    icon: Briefcase,
  },
  {
    href: "/interview-packs",
    title: "Interview packs",
    description: "150 questions per role, sorted by difficulty.",
    icon: BookOpen,
  },
];

const stats = [
  { label: "Skill aliases", value: "60+" },
  { label: "Interview questions", value: "900" },
  { label: "Role packs", value: "6" },
  { label: "Planner roles", value: "5" },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const fullName = user?.user_metadata?.full_name || "Career Builder";
  const roleText = user?.user_metadata?.role
    ? user.user_metadata.role.replace("_", " ").toUpperCase()
    : "USER";

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <PageHeader
          title={`Welcome back, ${fullName}`}
          description="Your premium career intelligence workspace."
        />

        {user && (
          <Card className="shrink-0 border-accent-green/20 bg-accent-green/5">
            <CardBody className="py-3 px-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center text-accent-green">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-accent-green tracking-wider">{roleText}</p>
                <p className="text-[10px] text-text-secondary">{user.email}</p>
              </div>
              <form action={signOutAction} className="ml-2 border-l border-[var(--border-muted)] pl-3">
                <button
                  type="submit"
                  title="Sign out"
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-400 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </CardBody>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardBody className="py-5">
              <p className="text-2xl font-semibold text-text-primary">{s.value}</p>
              <p className="text-sm text-text-secondary mt-1">{s.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <h2 className="text-sm font-medium text-text-secondary mb-4">Core Tools</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {tools.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-colors hover:border-accent-green/30">
              <CardBody className="flex flex-col h-full py-6">
                <Icon className="w-5 h-5 text-accent-green mb-4" />
                <h3 className="font-medium text-text-primary group-hover:text-accent-green transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-text-secondary mt-2 flex-1">{description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-accent-green mt-4">
                  Open <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
