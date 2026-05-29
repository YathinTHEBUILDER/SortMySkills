"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import gsap from "gsap";
import { FileText, Clipboard, CheckCircle2, AlertTriangle, Layers, Clock, RotateCcw } from "lucide-react";

import { extractSkillsFromText } from "@/lib/skill-map";

const COURSERA_COURSES = [
  {
    title: "Meta Front-End Developer Professional Certificate",
    skills: ["React", "JavaScript", "Tailwind CSS", "Git"],
    duration: "4 Months",
    provider: "Meta"
  },
  {
    title: "Google Data Analytics Professional Certificate",
    skills: ["SQL", "Python", "Data Science"],
    duration: "6 Months",
    provider: "Google"
  },
  {
    title: "Deep Learning Specialization — DeepLearning.AI",
    skills: ["Python", "Machine Learning"],
    duration: "5 Months",
    provider: "DeepLearning.AI"
  },
  {
    title: "Google UX Design Professional Certificate",
    skills: ["UX Design", "Figma"],
    duration: "6 Months",
    provider: "Google"
  },
  {
    title: "Brand Management Specialization — University of London",
    skills: ["Product Management"],
    duration: "3 Months",
    provider: "University of London"
  }
];

const SAMPLE_RESUME = `HARSH KUMAR
Frontend Software Engineer | harsh@example.com

SUMMARY
Highly motivated interface engineer with 1 year of experience building single-page applications. Focused on writing clean, scalable JavaScript and managing code structures using Git and GitHub.

TECHNICAL CAPABILITIES
- Programming: JavaScript (ES5/ES6), HTML, CSS
- Libraries: React, reactjs
- Workflow: Git, Command Line`;

const SAMPLE_JD = `Frontend Software Engineer (React)
Location: Remote | Full-Time

ROLE DESCRIPTION
We are looking for a Frontend Engineer to scale our web applications. You will build highly responsive UI components using React, enforce codebase type safety using TypeScript, write utility classes in Tailwind CSS, and collaborate with engineers using Git.

REQUIRED SKILLS
- 2+ years of professional web engineering
- Proficient in JavaScript and TypeScript
- Strong familiarity with React
- Style interfaces with Tailwind CSS
- Manage repos with Git`;

export default function JobMatch() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    resumeSkills: string[];
    jdSkills: string[];
    matched: string[];
    missing: string[];
    supplementary: string[];
  } | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  // Load sample dataset
  const handleLoadSamples = () => {
    setResumeText(SAMPLE_RESUME);
    setJdText(SAMPLE_JD);
    
    gsap.fromTo(
      ".input-panel",
      { opacity: 0.7 },
      { opacity: 1, duration: 0.4 }
    );
  };

  // Reset page state
  const handleReset = () => {
    setResumeText("");
    setJdText("");
    setAnalysisResult(null);
  };

  // Run dynamic analysis logic
  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || !jdText.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate compilation loading state
    setTimeout(() => {
      // NLP/Tag parsing logic
      const parsedResume = extractSkillsFromText(resumeText);
      const parsedJD = extractSkillsFromText(jdText);

      // Calculations
      const matched = parsedJD.filter((s) => parsedResume.includes(s));
      const missing = parsedJD.filter((s) => !parsedResume.includes(s));
      const supplementary = parsedResume.filter((s) => !parsedJD.includes(s));
      
      const score = parsedJD.length > 0 
        ? Math.round((matched.length / parsedJD.length) * 100) 
        : 0;

      setAnalysisResult({
        score,
        resumeSkills: parsedResume,
        jdSkills: parsedJD,
        matched,
        missing,
        supplementary
      });
      setIsAnalyzing(false);

      // GSAP animate result block entrance
      setTimeout(() => {
        gsap.fromTo(
          resultRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
        );
      }, 50);
    }, 1500);
  };

  // Fetch Coursera suggestions based on missing skill tags
  const getCourseraBridges = (missing: string[]) => {
    return COURSERA_COURSES.filter((course) =>
      course.skills.some((skill) => missing.includes(skill))
    );
  };

  const bridges = analysisResult ? getCourseraBridges(analysisResult.missing) : [];

  return (
    <div className="min-h-screen dot-grid-overlay bg-bg-dark text-text-primary pt-24 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 z-10 relative">
        {/* Page Header */}
        <div className="mb-12 fine-border-b pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-accent-cyan" />
              <span className="mono-tag text-accent-cyan">PATHWAY 02 — COMPARATOR LAB</span>
            </div>
            <h1 className="text-4xl font-light tracking-tight">Job Match Analysis</h1>
            <p className="text-text-secondary text-sm max-w-xl mt-2 leading-relaxed">
              Compare your credentials side-by-side with actual job descriptions. Detect missing tags, and bridge gaps with verified study plans.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleLoadSamples}
              className="px-4 py-2 bg-surface-card hover:bg-surface-hover fine-line font-mono text-xs uppercase tracking-wider transition-all"
            >
              Load Sample Datasets
            </button>
            {analysisResult && (
              <button
                onClick={handleReset}
                className="px-3 py-2 bg-transparent fine-line hover:border-text-secondary text-text-secondary hover:text-text-primary transition-all flex items-center gap-1.5 font-mono text-xs uppercase"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Inputs Panels Section */}
        {!analysisResult && (
          <form onSubmit={handleRunAnalysis} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Panel 1: Resume Upload / Paste */}
            <div className="input-panel bg-surface-card/65 backdrop-blur-sm fine-line p-6 flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="flex items-center justify-between pb-3 fine-border-b mb-6">
                  <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">INPUT A: YOUR RESUME</span>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-text-secondary" />
                    <span className="text-[9px] font-mono text-text-secondary">RAW TEXT OR paste</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Paste the plain text of your resume or drag-and-drop your profile content below. Our parser isolates core competencies.
                  </p>
                  <textarea
                    className="w-full bg-bg-dark/80 fine-line p-4 text-xs font-mono text-text-primary h-64 focus:outline-none focus:border-accent-cyan rounded-none"
                    placeholder="Paste Resume Content here... e.g. Experienced frontend developer with expertise in React, JavaScript, HTML, CSS, and version control with Git."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 mt-6 fine-border-t text-[10px] font-mono text-text-secondary flex justify-between">
                <span>FORMAT: UTF-8 PLAIN TEXT</span>
                <span>STATUS: READY</span>
              </div>
            </div>

            {/* Panel 2: Job Description Paste */}
            <div className="input-panel bg-surface-card/65 backdrop-blur-sm fine-line p-6 flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="flex items-center justify-between pb-3 fine-border-b mb-6">
                  <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">INPUT B: JOB DESCRIPTION</span>
                  <div className="flex items-center gap-1.5">
                    <Clipboard className="w-3.5 h-3.5 text-text-secondary" />
                    <span className="text-[9px] font-mono text-text-secondary">TARGET REQUIREMENT</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Paste the target job description requirements. We extract the standard technical tools needed by the recruiter.
                  </p>
                  <textarea
                    className="w-full bg-bg-dark/80 fine-line p-4 text-xs font-mono text-text-primary h-64 focus:outline-none focus:border-accent-cyan rounded-none"
                    placeholder="Paste Job Description requirements here... e.g. We require 2 years of React experience. Strong typing in TypeScript is highly preferred. Style interfaces using Tailwind CSS."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 mt-6 fine-border-t flex items-center justify-between w-full">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full py-2.5 bg-accent-cyan text-bg-dark font-mono text-xs uppercase tracking-wider font-bold hover:bg-accent-green hover:text-bg-dark transition-all disabled:bg-surface-hover disabled:text-text-secondary"
                >
                  {isAnalyzing ? "Compiling Match Matrices..." : "Calculate Competency Gaps"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Loading Indicator */}
        {isAnalyzing && (
          <div className="py-24 flex flex-col items-center justify-center space-y-4 fine-line bg-surface-card/30">
            <span className="w-8 h-8 fine-line border-t-accent-cyan animate-spin rounded-full" />
            <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              SCANNING TOKENS & ALIGNING TAXONOMIES
            </span>
          </div>
        )}

        {/* Analysis Results Dashboard */}
        {analysisResult && !isAnalyzing && (
          <div ref={resultRef} className="space-y-8">
            
            {/* Upper Stats Row: Match Score & Analysis summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Asymmetric Left: Match Score gauge (4 columns) */}
              <div className="lg:col-span-4 bg-surface-card/75 fine-line p-6 flex flex-col justify-between">
                <div>
                  <span className="block text-[10px] font-mono text-text-secondary uppercase tracking-widest pb-3 fine-border-b mb-6">
                    OVERALL COMPATIBILITY
                  </span>
                  
                  <div className="text-center py-8">
                    <span className="text-7xl sm:text-8xl font-light tracking-tighter text-text-primary">
                      {analysisResult.score}%
                    </span>
                    <span className="block font-mono text-[10px] uppercase text-text-secondary tracking-widest mt-4">
                      MATHEMATICAL MATCH SCORE
                    </span>
                  </div>
                </div>

                <div className="fine-border-t pt-4 text-[11px] font-mono text-text-secondary leading-relaxed">
                  {analysisResult.score >= 80 
                    ? "Strong compatibility. Your technical tags represent high alignment with the JD required tools."
                    : analysisResult.score >= 50
                    ? "Moderate compatibility. You meet core framework baselines but have critical missing nodes."
                    : "Low compatibility. Significant competency gaps detected. Targeted Coursera roadmap is highly recommended."}
                </div>
              </div>

              {/* Asymmetric Right: Skills Venn breakdown (8 columns) */}
              <div className="lg:col-span-8 bg-surface-card/30 fine-line p-6">
                <span className="block text-[10px] font-mono text-text-secondary uppercase tracking-widest pb-3 fine-border-b mb-6">
                  TAXONOMY ALIGNMENT MATRIX
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Column 1: Present Skills (Matched) */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 text-accent-green font-mono text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" /> Aligned Assets ({analysisResult.matched.length})
                    </div>
                    <div className="p-4 bg-bg-dark/40 fine-line min-h-[140px] flex flex-wrap gap-2 items-start">
                      {analysisResult.matched.length === 0 ? (
                        <span className="text-[10px] font-mono text-text-secondary">No direct skill matches detected.</span>
                      ) : (
                        analysisResult.matched.map((s) => (
                          <span key={s} className="px-2.5 py-0.5 bg-surface-hover fine-line text-[11px] font-mono text-accent-green">
                            {s}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Column 2: Missing Skills (Gaps) */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 text-accent-cyan font-mono text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" /> Critical Gaps ({analysisResult.missing.length})
                    </div>
                    <div className="p-4 bg-bg-dark/40 fine-line min-h-[140px] flex flex-wrap gap-2 items-start">
                      {analysisResult.missing.length === 0 ? (
                        <span className="text-[10px] font-mono text-accent-green">No missing requirements. Perfect align!</span>
                      ) : (
                        analysisResult.missing.map((s) => (
                          <span key={s} className="px-2.5 py-0.5 bg-surface-hover fine-line text-[11px] font-mono text-accent-cyan font-bold">
                            {s}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Column 3: Supplementary Skills (Extra) */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 text-text-secondary font-mono text-xs uppercase tracking-wider">
                      <Layers className="w-4 h-4" /> Supplementary Assets ({analysisResult.supplementary.length})
                    </div>
                    <div className="p-4 bg-bg-dark/40 fine-line min-h-[140px] flex flex-wrap gap-2 items-start">
                      {analysisResult.supplementary.length === 0 ? (
                        <span className="text-[10px] font-mono text-text-secondary">No additional tech tools in resume.</span>
                      ) : (
                        analysisResult.supplementary.map((s) => (
                          <span key={s} className="px-2.5 py-0.5 bg-surface-hover fine-line text-[11px] font-mono text-text-secondary">
                            {s}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Bridge Curricula (Coursera gap bridging) */}
            <div className="space-y-4">
              <span className="block text-[11px] font-mono text-accent-cyan uppercase tracking-widest">
                TARGETED COURSERA ROADMAP (BRIDGING COMPETENCY GAPS)
              </span>

              {analysisResult.missing.length === 0 ? (
                <div className="p-6 bg-surface-card/25 fine-line flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-accent-green" />
                  <div>
                    <h4 className="text-sm font-mono uppercase text-text-primary">Resume Meets 100% of Recruiter Requirements</h4>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      Excellent alignment. Your technical profile contains every tag extracted from the target Job Description. You are fully compatible for this application.
                    </p>
                  </div>
                </div>
              ) : bridges.length === 0 ? (
                <div className="p-6 bg-surface-card/25 fine-line text-xs font-mono text-text-secondary">
                  No direct course bridge mapping present in our current directory for the custom tech tags: {analysisResult.missing.join(", ")}. We are constantly expanding our curriculum databases.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bridges.map((course, idx) => {
                    const matchedMissing = course.skills.filter((s) => analysisResult.missing.includes(s));
                    return (
                      <div key={idx} className="p-6 bg-surface-card/45 fine-line flex flex-col justify-between min-h-[220px] hover:border-accent-cyan transition-all duration-300">
                        <div className="space-y-3">
                          <span className="px-2.5 py-0.5 bg-bg-dark fine-line text-accent-green font-mono text-[9px] uppercase tracking-wider">
                            GAP BRIDGE SPECIALIZATION
                          </span>
                          <h4 className="text-base text-text-primary font-normal leading-snug">{course.title}</h4>
                          <p className="text-xs text-text-secondary font-mono flex items-center gap-1.5 pt-1">
                            <Clock className="w-3.5 h-3.5 text-text-secondary" /> Duration: {course.duration} | Provider: {course.provider}
                          </p>
                          
                          <div className="pt-2">
                            <span className="block text-[9px] font-mono text-text-secondary uppercase mb-1">BRIDGES GAPS IN:</span>
                            <div className="flex flex-wrap gap-1">
                              {matchedMissing.map((s) => (
                                <span key={s} className="px-2 py-0.5 bg-bg-dark fine-line text-[10px] font-mono text-accent-cyan font-bold">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-6">
                          <a
                            href={`https://www.coursera.org/search?query=${encodeURIComponent(course.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto px-4 py-2 bg-text-primary hover:bg-accent-green text-bg-dark font-mono text-[10px] uppercase font-bold tracking-wider transition-all inline-block text-center"
                          >
                            Explore Syllabus
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Back button to start over */}
            <div className="pt-8 text-center">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-surface-card hover:bg-surface-hover fine-line text-text-primary font-mono text-xs uppercase tracking-wider transition-all"
              >
                Analyze Another Job Description
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
