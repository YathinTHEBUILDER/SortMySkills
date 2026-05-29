import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { INTERVIEW_PACKS } from "@/data/interview-packs";
import { ArrowRight } from "lucide-react";

export default function InterviewPacksPage() {
  return (
    <>
      <PageHeader
        title="Interview packs"
        description="100 questions per role — easy, medium, and hard — for mock interviews and self-study."
      />

      <div className="grid sm:grid-cols-2 gap-4">
        {INTERVIEW_PACKS.map((pack) => {
          const easy = pack.questions.filter((q) => q.difficulty === "easy").length;
          const medium = pack.questions.filter((q) => q.difficulty === "medium").length;
          const hard = pack.questions.filter((q) => q.difficulty === "hard").length;

          return (
            <Link key={pack.id} href={`/interview-packs/${pack.slug}`}>
              <Card className="h-full hover:border-accent-green/30 transition-colors">
                <CardBody className="py-6">
                  <h2 className="font-medium text-text-primary">{pack.title}</h2>
                  <p className="text-sm text-text-secondary mt-2 line-clamp-2">{pack.description}</p>
                  <p className="text-xs text-text-secondary mt-4">
                    Easy {easy} · Med {medium} · Hard {hard}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-accent-green mt-4">
                    Open pack <ArrowRight className="w-4 h-4" />
                  </span>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
