import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  ScanSearch,
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
    href: "/tools/parser",
    title: "Skill parser",
    description: "Normalize messy skill text into standard tags.",
    icon: ScanSearch,
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

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Your career workspace — plan skills, compare jobs, and prepare for interviews."
      />

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

      <h2 className="text-sm font-medium text-text-secondary mb-4">Tools</h2>
      <div className="grid sm:grid-cols-2 gap-4">
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
