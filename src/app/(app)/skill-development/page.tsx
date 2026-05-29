"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { ROLES_DATABASE, type Role } from "@/data/roles";
import { Check, ArrowRight, DollarSign, Award, Target, BookOpen } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function SkillDevelopmentPage() {
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES_DATABASE[0]);
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
    <div className="space-y-8 animate-fade-in relative z-10">
      <PageHeader
        title="Skill Planner"
        description="Choose a target role, mark what you already know, and see courses that close the gaps."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Select Target Role */}
        <div className="space-y-6">
          <Card className="premium-card relative overflow-hidden animated-border">
            <div className="absolute inset-0 dot-grid-overlay opacity-20 pointer-events-none" />
            <CardHeader 
              title="Target Role" 
              className="relative z-10 border-b border-[var(--border-muted)] pb-3"
            />
            <CardBody className="pt-4 space-y-2 relative z-10">
              {ROLES_DATABASE.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left rounded-lg px-4 py-3 text-xs font-mono uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                    selectedRole.id === role.id
                      ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary font-bold shadow-xs"
                      : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover/80"
                  }`}
                >
                  {role.title}
                </button>
              ))}
            </CardBody>
          </Card>

          <Card className="premium-card">
            <CardBody className="py-6 px-6">
              <span className="eyebrow block text-[8px] tracking-widest mb-2">Role Overview</span>
              <p className="text-xs text-text-secondary leading-relaxed">{selectedRole.description}</p>
              
              <div className="mt-6 border-t border-[var(--border-muted)] pt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface-soft)] border border-[var(--border-muted)] flex items-center justify-center text-accent-secondary">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-text-muted uppercase">Salary</span>
                    <p className="text-xs font-bold text-text-primary">{selectedRole.typicalSalary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface-soft)] border border-[var(--border-muted)] flex items-center justify-center text-accent-green">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-text-muted uppercase">Difficulty</span>
                    <p className="text-xs font-bold text-accent-green">{selectedRole.difficulty}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Skills Audit & Readiness Chart */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="premium-card relative overflow-hidden">
            <div className="absolute inset-0 dot-grid-overlay opacity-10 pointer-events-none" />
            <CardHeader
              title="Skill Audit"
              description="Mark the baseline skills you can confidently demonstrate today."
              className="border-b border-[var(--border-muted)] pb-3"
            />
            <CardBody className="pt-5 px-6">
              <div className="grid sm:grid-cols-2 gap-8">
                {/* Skill Toggles */}
                <div className="space-y-2">
                  <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-3">Your Skills checklist</span>
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
                        className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-xs font-mono uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                          on
                            ? "border-accent-primary/30 bg-accent-primary/5 text-text-primary font-semibold shadow-xs"
                            : "border-[var(--border-muted)] text-text-secondary hover:bg-surface-hover/80"
                        }`}
                      >
                        <span>{skill}</span>
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                            on ? "bg-accent-primary border-accent-primary text-[#F6F1E8]" : "border-[var(--border-muted)]"
                          }`}
                        >
                          {on && <Check className="w-3 h-3" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Score Chart */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2">Readiness Score</span>
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl font-bold tracking-tight text-accent-primary">{readiness}%</p>
                      <span className="text-xs font-mono text-text-secondary uppercase">Ready</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                      {readiness === 100
                        ? "Excellent! You fully cover all baseline capabilities for this placement profile."
                        : `${present.length} of ${selectedRole.skills.length} skills acquired · ${missing.length} remaining gap(s).`}
                    </p>
                  </div>

                  <div className="h-32 mt-6">
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: "monospace" }} stroke="var(--text-muted)" />
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
                              fontSize: "10px",
                              fontFamily: "monospace",
                            }}
                          />
                          <Bar dataKey="have" fill="var(--accent-primary)" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Study Roadmap */}
          <Card className="premium-card">
            <CardHeader 
              title="Skill Gaps & Study Roadmap" 
              className="border-b border-[var(--border-muted)] pb-3"
            />
            <CardBody className="pt-5 px-6">
              {missing.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center text-accent-green mx-auto mb-4 border border-accent-green/20">
                    <Target className="w-5 h-5" />
                  </div>
                  <p className="text-text-primary font-bold text-sm font-mono uppercase tracking-wider">All baseline targets met</p>
                  <p className="text-xs text-text-secondary mt-2 max-w-sm mx-auto leading-relaxed">
                    You have audited all standard skills. Try the Job Description Matcher to test your profile against a custom placement description.
                  </p>
                  <ButtonLink href="/job-match" className="mt-6 font-mono uppercase tracking-widest text-[#F6F1E8] bg-accent-primary">
                    Try Job Match <ArrowRight className="w-4 h-4 ml-1" />
                  </ButtonLink>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-lg bg-[var(--surface-soft)]/50 border border-[var(--border-muted)] p-3 flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-accent-secondary shrink-0" />
                    <p className="text-xs text-text-secondary">
                      Remaining Gaps: <span className="font-semibold text-text-primary">{missing.join(", ")}</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectedRole.courses.map((course) => {
                      const covers = course.skills.filter((s) => missing.includes(s));
                      if (!covers.length) return null;
                      return (
                        <div
                          key={course.title}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[var(--border-muted)] p-4 hover:border-accent-primary/30 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-text-primary text-xs font-mono uppercase tracking-wider">{course.title}</p>
                            <p className="text-[11px] text-text-secondary mt-1.5">
                              Focuses on <span className="font-medium text-text-primary">{covers.join(", ")}</span> · {course.duration} · {course.provider}
                            </p>
                          </div>
                          <a
                            href={`https://www.coursera.org/search?query=${encodeURIComponent(course.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-accent-primary hover:underline shrink-0"
                          >
                            <span>Study Course</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
