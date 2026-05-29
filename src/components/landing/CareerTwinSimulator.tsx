"use client";

import React, { useState } from "react";
import { AlertTriangle, ArrowUpRight, Award, Plus, Check } from "lucide-react";

interface SkillOption {
  id: string;
  name: string;
  category: string;
  points: number;
}

const AVAILABLE_SIMULATION_SKILLS: SkillOption[] = [
  { id: "ts", name: "Learn TypeScript", category: "Frontend", points: 15 },
  { id: "sql", name: "Add SQL Database", category: "Database", points: 20 },
  { id: "docker", name: "Deploy via Docker/AWS", category: "DevOps", points: 25 },
  { id: "figma", name: "Practice Figma UI/UX", category: "Design", points: 10 },
];

export default function CareerTwinSimulator() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate scores based on toggled skills
  const isTs = selectedSkills.includes("ts");
  const isSql = selectedSkills.includes("sql");
  const isDocker = selectedSkills.includes("docker");
  const isFigma = selectedSkills.includes("figma");

  let baseScore = 42;
  if (isTs) baseScore += 18;
  if (isSql) baseScore += 15;
  if (isDocker) baseScore += 16;
  if (isFigma) baseScore += 9;
  
  if (baseScore > 100) baseScore = 100;

  // Determine role alignments
  let strongestRole = "Frontend Learner";
  let targetMatch = 48;
  let riskLevel = "High";
  let riskDesc = "Lacks type safety, cloud pipelines, or structured databases.";
  let growthLever = "Learn TypeScript to secure typed React applications.";

  if (isTs && !isSql && !isDocker) {
    strongestRole = "Junior Frontend Engineer";
    targetMatch = 72;
    riskLevel = "Medium";
    riskDesc = "Lacks back-end logic or state persistence schemas.";
    growthLever = "Add a SQL Database to unlock full-stack placement opportunities.";
  } else if (!isTs && isSql && !isDocker) {
    strongestRole = "Junior Data Analyst";
    targetMatch = 65;
    riskLevel = "Medium";
    riskDesc = "Lacks scalable cloud pipelines or modern front-ends.";
    growthLever = "Learn TypeScript/React to design dynamic dashboard views.";
  } else if (isTs && isSql && !isDocker) {
    strongestRole = "Full-Stack Web Developer";
    targetMatch = 84;
    riskLevel = "Low";
    riskDesc = "Solid front/back integration. Needs deployment automation.";
    growthLever = "Containerize with Docker to prove cloud-ready systems.";
  } else if (isTs && isSql && isDocker) {
    strongestRole = "DevOps & Cloud Engineer";
    targetMatch = 93;
    riskLevel = "Extremely Low";
    riskDesc = "Ready for senior placement evaluations.";
    growthLever = "Refine Figma basics to support collaborative product layouts.";
  } else if (isDocker && !isTs && !isSql) {
    strongestRole = "Cloud Infrastructure Intern";
    targetMatch = 60;
    riskLevel = "Medium";
    riskDesc = "Strong DevOps baseline, but lacks core product coding.";
    growthLever = "Pair with TypeScript to build automated developer dashboards.";
  } else if (isFigma && !isTs && !isSql && !isDocker) {
    strongestRole = "Junior UX Designer";
    targetMatch = 55;
    riskLevel = "High";
    riskDesc = "Excellent visual wireframes, but cannot implement production code.";
    growthLever = "Learn TypeScript to turn your static designs into live apps.";
  } else if (isFigma && isTs && isSql && isDocker) {
    strongestRole = "Product-Minded Full-Stack Architect";
    targetMatch = 98;
    riskLevel = "Elite";
    riskDesc = "Complete full-stack, cloud architecture, and product design readiness.";
    growthLever = "You are fully optimized! Apply to top tier placements.";
  } else if (isFigma && isTs && !isSql && !isDocker) {
    strongestRole = "Product Engineer (Frontend)";
    targetMatch = 80;
    riskLevel = "Low";
    riskDesc = "Excellent visuals and typed components. Lacks database pipelines.";
    growthLever = "Implement SQL data layers to bridge product states.";
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left controls panel */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-card-warm)] text-left h-full">
        <div>
          <span className="eyebrow text-accent-primary">What-If Sandbox</span>
          <h3 className="text-xl font-bold text-text-primary mt-2 tracking-tight">
            Grow Your Skill DNA
          </h3>
          <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
            Toggle the technical learning metrics below to instantly see how SortMySkills maps your profile updates, scores, and rejection risk triggers in real-time.
          </p>

          {/* Interactive Skill Toggles */}
          <div className="space-y-3 mt-6">
            {AVAILABLE_SIMULATION_SKILLS.map((skill) => {
              const isSelected = selectedSkills.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-mono tracking-wide transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-accent-primary/10 border-accent-primary text-accent-primary shadow-xs font-bold"
                      : "bg-surface-card border-[var(--border-muted)] text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold px-2 py-0.5 text-[8px] uppercase rounded border border-[var(--border-muted)] bg-[var(--surface-soft)]/50">
                      {skill.category}
                    </span>
                    <span>{skill.name}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected 
                      ? "bg-accent-primary border-accent-primary text-[#F8F3EA]" 
                      : "border-[var(--border-strong)] text-text-muted"
                  }`}>
                    {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[var(--border-muted)] text-[10px] text-text-muted leading-relaxed">
          💡 <strong>Why this matters:</strong> SortMySkills calculates these roadmaps automatically based on the skills extracted from your actual resume uploads.
        </div>
      </div>

      {/* Right Mock Twin Dashboard */}
      <div className="lg:col-span-7 rounded-2xl border border-[var(--border-muted)] bg-surface-card p-6 shadow-md relative overflow-hidden animated-border flex flex-col justify-between h-full">
        {/* Dot pattern */}
        <div className="absolute inset-0 dot-grid-overlay opacity-20 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse" />
              <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
                Career Twin Simulator
              </span>
            </div>
            <span className="font-mono text-[8px] text-text-muted">ID: TWIN_SIM_2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Readiness Dial */}
            <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/35 p-4 flex flex-col justify-between">
              <span className="font-mono text-[9px] text-text-muted uppercase">Readiness Quotient</span>
              
              <div className="flex items-center gap-4 mt-3">
                {/* SVG Dial */}
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" stroke="var(--border-muted)" strokeWidth="4" fill="none" />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="var(--accent-primary)"
                      strokeWidth="4.5"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - baseScore / 100)}
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <span className="text-sm font-mono font-bold text-text-primary">{baseScore}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-accent-primary uppercase tracking-widest">Alignment Score</span>
                  <p className="text-xs font-semibold text-text-secondary mt-0.5 leading-snug">
                    Competency mapped to industry standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Twin Alignment Card */}
            <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/35 p-4 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[9px] text-text-muted uppercase">Strongest Role Twin</span>
                <p className="text-sm font-bold text-text-primary mt-1.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-accent-secondary" />
                  <span>{strongestRole}</span>
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[var(--border-muted)] flex items-center justify-between text-[10px]">
                <span className="text-text-muted">Target Placement Match:</span>
                <span className="font-mono font-bold text-text-primary">{targetMatch}%</span>
              </div>
            </div>
          </div>

          {/* Placement Risks & Safety Meter */}
          <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/35 p-4 space-y-3.5 text-left">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-text-muted uppercase">Rejection Risk Indicator</span>
                <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border ${
                  riskLevel === "High" 
                    ? "bg-red-400/10 border-red-500/20 text-red-400"
                    : riskLevel === "Medium"
                      ? "bg-yellow-400/10 border-yellow-500/20 text-yellow-500"
                      : "bg-success/10 border-success/20 text-success"
                }`}>
                  {riskLevel}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-accent-primary shrink-0 mt-0.5" />
                <span>{riskDesc}</span>
              </p>
            </div>

            <div className="border-t border-[var(--border-muted)] pt-3">
              <span className="font-mono text-[9px] text-text-muted uppercase block mb-1">Recommended Skill Bridge</span>
              <p className="text-xs font-semibold text-text-primary leading-relaxed">
                {growthLever}
              </p>
            </div>
          </div>
        </div>

        {/* Action Link */}
        <div className="relative z-10 border-t border-[var(--border-muted)] pt-4 mt-6 flex justify-between items-center text-[10px]">
          <span className="font-mono text-text-muted">ACTIVE SIMULATION FLOW</span>
          <span className="flex items-center gap-1 text-accent-primary font-mono uppercase tracking-wider font-bold">
            <span>Audit Your Skills</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
