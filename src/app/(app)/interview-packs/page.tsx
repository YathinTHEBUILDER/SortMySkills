import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { INTERVIEW_PACKS } from "@/data/interview-packs";
import { ArrowRight, BookOpen } from "lucide-react";

export default function InterviewPacksPage() {
  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <PageHeader
        title="Placement Interview Packs"
        description="150 questions per role (50 easy, 50 medium, 50 hard) — sorted and ready for mock interviews."
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {INTERVIEW_PACKS.map((pack) => {
          const easy = pack.questions.filter((q) => q.difficulty === "easy").length;
          const medium = pack.questions.filter((q) => q.difficulty === "medium").length;
          const hard = pack.questions.filter((q) => q.difficulty === "hard").length;

          return (
            <Link key={pack.id} href={`/interview-packs/${pack.slug}`} className="group">
              <Card className="premium-card h-full transition-all duration-300 group-hover:border-accent-primary relative overflow-hidden flex flex-col justify-between">
                <CardBody className="py-6 px-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4 mb-4">
                      <h2 className="font-semibold text-text-primary text-base group-hover:text-accent-primary transition-colors tracking-tight">
                        {pack.title}
                      </h2>
                      <BookOpen className="w-4 h-4 text-accent-secondary" />
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{pack.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border-muted)] flex flex-col gap-3">
                    {/* Visual Difficulty Grid */}
                    <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted uppercase">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                        <span>Easy {easy}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
                        <span>Med {medium}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                        <span>Hard {hard}</span>
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-accent-primary">
                      <span>Open Pack</span> 
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
