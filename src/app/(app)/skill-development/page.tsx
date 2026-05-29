"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { ROLES_DATABASE } from "@/data/roles";
import { Check, ArrowRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function SkillDevelopmentPage() {
  const [selectedRole, setSelectedRole] = useState(ROLES_DATABASE[0]);
  const [userSkills, setUserSkills] = useState<string[]>(["JavaScript", "Git"]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const present = selectedRole.skills.filter((s) => userSkills.includes(s));
  const missing = selectedRole.skills.filter((s) => !userSkills.includes(s));
  const readiness = Math.round((present.length / selectedRole.skills.length) * 100);

  const chartData = selectedRole.skills.map((skill) => ({
    name: skill.length > 10 ? `${skill.slice(0, 8)}…` : skill,
    full: skill,
    have: userSkills.includes(skill) ? 10 : 2,
  }));

  return (
    <>
      <PageHeader
        title="Skill planner"
        description="Choose a target role, mark what you already know, and see courses that close the gaps."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader title="Target role" />
            <CardBody className="pt-0 space-y-2">
              {ROLES_DATABASE.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left rounded-lg px-4 py-3 text-sm transition-colors ${
                    selectedRole.id === role.id
                      ? "bg-accent-green/15 text-accent-green font-medium"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                  }`}
                >
                  {role.title}
                </button>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="py-5">
              <p className="text-sm text-text-secondary">{selectedRole.description}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-text-secondary">Salary</dt>
                  <dd className="text-text-primary font-medium">{selectedRole.typicalSalary}</dd>
                </div>
                <div>
                  <dt className="text-text-secondary">Difficulty</dt>
                  <dd className="text-accent-green font-medium">{selectedRole.difficulty}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Your skills"
              description="Toggle skills you can demonstrate with projects or work experience."
            />
            <CardBody className="pt-0">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  {selectedRole.skills.map((skill) => {
                    const on = userSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() =>
                          setUserSkills((prev) =>
                            on ? prev.filter((s) => s !== skill) : [...prev, skill]
                          )
                        }
                        className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-sm border transition-colors ${
                          on
                            ? "border-accent-green/40 bg-accent-green/5 text-text-primary"
                            : "border-[var(--border-muted)] text-text-secondary hover:bg-surface-hover"
                        }`}
                      >
                        {skill}
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center ${
                            on ? "bg-accent-green text-bg-dark" : "border border-[var(--border-muted)]"
                          }`}
                        >
                          {on && <Check className="w-3 h-3" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <p className="text-5xl font-semibold text-text-primary">{readiness}%</p>
                  <p className="text-sm text-text-secondary mt-2">
                    {readiness === 100
                      ? "You cover all baseline skills for this role."
                      : `${present.length} of ${selectedRole.skills.length} skills — ${missing.length} gap(s).`}
                  </p>
                  <div className="h-36 mt-6">
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--color-text-secondary)" />
                          <YAxis hide domain={[0, 10]} />
                          <Tooltip
                            formatter={(_, __, item) => [
                              (item.payload as { full: string }).full,
                              "Skill",
                            ]}
                            contentStyle={{
                              background: "var(--surface-card)",
                              border: "1px solid var(--border-muted)",
                              borderRadius: 8,
                            }}
                          />
                          <Bar dataKey="have" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Study roadmap" />
            <CardBody className="pt-0">
              {missing.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-primary font-medium">No gaps for this role</p>
                  <p className="text-sm text-text-secondary mt-2">
                    Try job match to compare against a real job description.
                  </p>
                  <ButtonLink href="/job-match" className="mt-6">
                    Job match <ArrowRight className="w-4 h-4" />
                  </ButtonLink>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-text-secondary">
                    Focus areas: <span className="text-text-primary">{missing.join(", ")}</span>
                  </p>
                  {selectedRole.courses.map((course) => {
                    const covers = course.skills.filter((s) => missing.includes(s));
                    if (!covers.length) return null;
                    return (
                      <div
                        key={course.title}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border border-[var(--border-muted)] p-4"
                      >
                        <div>
                          <p className="font-medium text-text-primary">{course.title}</p>
                          <p className="text-sm text-text-secondary mt-1">
                            Covers {covers.join(", ")} · {course.duration} · {course.provider}
                          </p>
                        </div>
                        <a
                          href={`https://www.coursera.org/search?query=${encodeURIComponent(course.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent-green hover:underline shrink-0"
                        >
                          View on Coursera
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
