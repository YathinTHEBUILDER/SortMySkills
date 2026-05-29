"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import Link from "next/link";
import gsap from "gsap";
import { Check, Compass, AlertCircle, Sparkles, BookOpen, Clock, Target, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const ROLES_DATABASE = [
  {
    id: "frontend",
    title: "Frontend Engineer",
    description: "Architects client-side user interfaces, manages application state, and ensures highly responsive rendering across devices.",
    typicalSalary: "$95,000 - $145,000",
    difficulty: "Moderate",
    skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Git"],
    courses: [
      {
        title: "Meta Front-End Developer Professional Certificate",
        skills: ["React", "JavaScript", "Tailwind CSS", "Git"],
        duration: "4 Months",
        provider: "Meta"
      }
    ]
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    description: "Transforms raw corporate data into structured business intelligence, builds dashboard pipelines, and optimizes query indexes.",
    typicalSalary: "$78,000 - $115,000",
    difficulty: "Moderate",
    skills: ["SQL", "Python", "Data Science", "Git"],
    courses: [
      {
        title: "Google Data Analytics Professional Certificate",
        skills: ["SQL", "Python", "Data Science"],
        duration: "6 Months",
        provider: "Google"
      }
    ]
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    description: "Trains deep predictive models, implements neural networks, and deploys highly scalable production AI inference pipelines.",
    typicalSalary: "$120,000 - $175,000",
    difficulty: "High",
    skills: ["Python", "Machine Learning", "Git"],
    courses: [
      {
        title: "Deep Learning Specialization — DeepLearning.AI",
        skills: ["Python", "Machine Learning"],
        duration: "5 Months",
        provider: "DeepLearning.AI"
      }
    ]
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    description: "Conducts deep user research, drafts wireframes, builds high-fidelity prototypes, and manages accessibility guidelines.",
    typicalSalary: "$82,000 - $125,000",
    difficulty: "Moderate",
    skills: ["UX Design", "Figma"],
    courses: [
      {
        title: "Google UX Design Professional Certificate",
        skills: ["UX Design", "Figma"],
        duration: "6 Months",
        provider: "Google"
      }
    ]
  },
  {
    id: "product-manager",
    title: "Product Manager",
    description: "Defines product roadmap scopes, audits metrics, balances engineering cycles, and aligns user stories with corporate strategies.",
    typicalSalary: "$105,000 - $160,000",
    difficulty: "Moderate",
    skills: ["Product Management"],
    courses: [
      {
        title: "Brand Management Specialization — University of London",
        skills: ["Product Management"],
        duration: "3 Months",
        provider: "University of London"
      }
    ]
  }
];

export default function SkillDevelopment() {
  const [selectedRole, setSelectedRole] = useState(ROLES_DATABASE[0]);
  const [userSkills, setUserSkills] = useState<string[]>(["JavaScript", "Git"]);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);

  // Set mounted client-side to prevent hydration mismatch with Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate elements when selecting role
  const handleRoleChange = (role: typeof ROLES_DATABASE[0]) => {
    setSelectedRole(role);
    
    // Animate target role detail switch using GSAP
    gsap.fromTo(
      ".role-anim",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );

    // Subtle fade in on roadmap
    gsap.fromTo(
      roadmapRef.current,
      { opacity: 0.8 },
      { opacity: 1, duration: 0.6 }
    );
  };

  // Toggle user skill audit selection
  const handleToggleSkill = (skill: string) => {
    setUserSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );

    // Quick pop effect for metrics indicator
    gsap.fromTo(
      ".readiness-stat",
      { scale: 0.95 },
      { scale: 1, duration: 0.3, ease: "back.out(1.5)" }
    );
  };

  // Compute stats
  const roleRequiredSkills = selectedRole.skills;
  const presentRequiredSkills = roleRequiredSkills.filter((s) => userSkills.includes(s));
  const missingSkills = roleRequiredSkills.filter((s) => !userSkills.includes(s));
  const readinessPercentage = Math.round((presentRequiredSkills.length / roleRequiredSkills.length) * 100);

  // Prepare chart data
  const chartData = roleRequiredSkills.map((skill) => ({
    name: skill,
    Required: 10,
    Current: userSkills.includes(skill) ? 10 : 2
  }));

  return (
    <div className="min-h-screen dot-grid-overlay bg-bg-dark text-text-primary pt-24 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 z-10 relative">
        {/* Header Block */}
        <div className="mb-12 fine-border-b pb-8">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-5 h-5 text-accent-green" />
            <span className="mono-tag text-accent-green">PATHWAY 01 — STUDY BLUEPRINT</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight">Skill Development Planner</h1>
          <p className="text-text-secondary text-sm max-w-xl mt-2 leading-relaxed">
            Choose your target destination, audit your current credentials, and let the index compile a precise Coursera learning trajectory.
          </p>
        </div>

        {/* Asymmetrical Grid layout */}
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Target Role Select (5 columns wide) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-card/60 fine-line p-6">
              <span className="block text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-4">TARGET ROLE SELECTION</span>
              
              <div className="space-y-2">
                {ROLES_DATABASE.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleChange(role)}
                    className={`w-full text-left p-3.5 fine-line font-mono text-xs uppercase tracking-wider transition-all rounded-none flex items-center justify-between ${
                      selectedRole.id === role.id
                        ? "bg-accent-green text-bg-dark border-accent-green font-bold"
                        : "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                    }`}
                  >
                    <span>{role.title}</span>
                    <span className="text-[10px]">
                      {selectedRole.id === role.id ? "[ACTIVE]" : "SELECT"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Role Profile display */}
            <div className="bg-surface-card/30 fine-line p-6 role-anim">
              <span className="block text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-3">ROLE BLUEPRINT DETAIL</span>
              <h3 className="text-xl font-normal text-text-primary mb-2">{selectedRole.title}</h3>
              <p className="text-text-secondary text-xs leading-relaxed mb-6">
                {selectedRole.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-[11px] font-mono fine-border-t pt-4">
                <div>
                  <span className="block text-text-secondary uppercase tracking-wider text-[9px]">SALARY RANGE</span>
                  <span className="block text-text-primary font-bold mt-0.5">{selectedRole.typicalSalary}</span>
                </div>
                <div>
                  <span className="block text-text-secondary uppercase tracking-wider text-[9px]">ACQUISITION CURVE</span>
                  <span className="block text-accent-green font-bold mt-0.5">{selectedRole.difficulty}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Skill Audit & Gap Visuals (7 columns wide) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Split Audit & Visual block */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-surface-card/40 fine-line p-6">
              
              {/* Skill Checklist (7 cols) */}
              <div className="md:col-span-6 space-y-4">
                <span className="block text-[10px] font-mono text-text-secondary uppercase tracking-widest">CAPABILITIES AUDIT</span>
                <p className="text-[11px] text-text-secondary leading-relaxed mb-2">
                  Check off the skills you can verify with projects or past work.
                </p>

                <div className="space-y-2">
                  {selectedRole.skills.map((skill) => {
                    const isChecked = userSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => handleToggleSkill(skill)}
                        className={`w-full p-3 fine-line flex items-center justify-between text-left font-mono text-xs transition-all ${
                          isChecked 
                            ? "bg-surface-hover border-accent-green text-text-primary" 
                            : "bg-transparent text-text-secondary hover:text-text-primary hover:border-text-secondary"
                        }`}
                      >
                        <span>{skill}</span>
                        <div className={`w-4 h-4 fine-line flex items-center justify-center rounded-none ${
                          isChecked ? "bg-accent-green border-accent-green text-bg-dark" : "bg-transparent"
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic stats display (5 cols) */}
              <div className="md:col-span-6 flex flex-col justify-between fine-border-t md:fine-border-t-0 md:fine-border-l md:pl-6 pt-6 md:pt-0">
                <div>
                  <span className="block text-[10px] font-mono text-text-secondary uppercase tracking-widest">ALIGNMENT RATIO</span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="readiness-stat text-5xl font-light text-text-primary tracking-tighter">
                      {readinessPercentage}%
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed mt-4">
                    {readinessPercentage === 100 
                      ? "Complete compatibility. Your current capabilities meet the target role profile baseline." 
                      : `You match ${presentRequiredSkills.length} out of ${roleRequiredSkills.length} core competencies. ${missingSkills.length} gaps detected.`}
                  </p>
                </div>

                <div className="mt-8 pt-4 fine-border-t">
                  <span className="block text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-3">ALIGNMENT GRAPH</span>
                  <div className="h-32 w-full">
                    {mounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                          <XAxis dataKey="name" stroke="#9c9c98" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis stroke="#9c9c98" fontSize={8} tickLine={false} axisLine={false} domain={[0, 10]} />
                          <Tooltip
                            contentStyle={{ background: "#141413", border: "0.5px solid rgba(244,244,243,0.1)", fontSize: 10, fontFamily: "monospace" }}
                            labelStyle={{ color: "#f4f4f3" }}
                          />
                          <Bar dataKey="Required" fill="rgba(244,244,243,0.08)" radius={0} />
                          <Bar dataKey="Current" fill="#3be87e" radius={0} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-[10px] font-mono text-text-secondary">
                        Loading Alignment Data...
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Study Trajectory / Coursera Roadmap (Dynamic) */}
            <div ref={roadmapRef} className="space-y-4">
              <span className="block text-[10px] font-mono text-accent-green uppercase tracking-widest">COMPILED STUDY ROADMAP</span>

              {missingSkills.length === 0 ? (
                <div className="p-6 bg-surface-card/25 fine-line flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center text-accent-green shrink-0 mt-0.5 fine-line">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm text-text-primary font-mono uppercase tracking-wider">No Competency Gaps Detected</h4>
                    <p className="text-xs text-text-secondary leading-relaxed mt-1">
                      Outstanding! You already possess all baseline technical tools listed in the {selectedRole.title} syllabus. You are ready to start comparative job auditing.
                    </p>
                    <Link
                      href="/job-match"
                      className="mt-4 px-4 py-1.5 bg-text-primary text-bg-dark font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-accent-green inline-flex items-center gap-1.5 transition-all"
                    >
                      Analyze Resume vs JD <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-surface-card/15 fine-line text-[11px] font-mono text-text-secondary flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-accent-cyan" />
                    <span>TRAJECTORY FOCUS: ACQUIRING {missingSkills.join(", ").toUpperCase()}</span>
                  </div>

                  <div className="space-y-3">
                    {selectedRole.courses.map((course, cIdx) => {
                      // Calculate relevance by checking how many missing skills this course covers
                      const coveredGaps = course.skills.filter((s) => missingSkills.includes(s));
                      if (coveredGaps.length === 0) return null;

                      return (
                        <div key={cIdx} className="p-6 bg-surface-card/45 fine-line flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="space-y-2">
                            <span className="px-2 py-0.5 bg-bg-dark fine-line text-accent-green font-mono text-[9px] uppercase tracking-wider">
                              CURATED COURSERA CURRICULUM
                            </span>
                            <h4 className="text-base text-text-primary font-normal">{course.title}</h4>
                            
                            <div className="flex flex-wrap gap-4 text-[10px] font-mono text-text-secondary pt-2">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" /> Covered Gaps: {coveredGaps.join(", ")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> Duration: {course.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="w-3.5 h-3.5" /> Provider: {course.provider}
                              </span>
                            </div>
                          </div>

                          <a
                            href={`https://www.coursera.org/search?query=${encodeURIComponent(course.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-text-primary text-bg-dark text-[10px] font-mono uppercase font-bold tracking-wider hover:bg-accent-green hover:text-bg-dark transition-all shrink-0 w-full md:w-auto text-center"
                          >
                            Study on Coursera
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
