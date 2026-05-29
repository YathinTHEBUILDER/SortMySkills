"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { extractSkillsFromText } from "@/lib/skill-map";

export default function ParserPage() {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = extractSkillsFromText(input);
    setTags(result.length > 0 ? result : []);
    setSubmitted(true);
  };

  const discipline =
    tags.includes("React") || tags.includes("Tailwind CSS")
      ? "Frontend engineering"
      : tags.includes("Python") || tags.includes("Machine Learning")
        ? "Data / ML"
        : tags.length > 0
          ? "General technology"
          : "—";

  return (
    <>
      <PageHeader
        title="Skill parser"
        description="Paste resume snippets, job requirements, or a skill list. We map aliases to standard tags using a local registry."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Input" description="Plain text only — no PDF yet." />
          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. reactjs, docker on GCP, graphql, tailwind"
                className="w-full h-40 rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent-green/30 resize-none"
              />
              <Button type="submit" className="w-full sm:w-auto">
                Normalize skills
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Output" />
          <CardBody className="pt-0">
            {!submitted ? (
              <p className="text-sm text-text-secondary py-8 text-center">
                Results appear here after you run the parser.
              </p>
            ) : tags.length === 0 ? (
              <p className="text-sm text-text-secondary py-8 text-center">
                No known skills detected. Try terms like react, python, aws, docker.
              </p>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm bg-accent-green/10 text-accent-green border border-accent-green/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg bg-[var(--background)] p-4 border border-[var(--border-muted)]">
                    <p className="text-text-secondary text-xs">Discipline</p>
                    <p className="text-text-primary font-medium mt-1">{discipline}</p>
                  </div>
                  <div className="rounded-lg bg-[var(--background)] p-4 border border-[var(--border-muted)]">
                    <p className="text-text-secondary text-xs">Tags found</p>
                    <p className="text-text-primary font-medium mt-1">{tags.length}</p>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
