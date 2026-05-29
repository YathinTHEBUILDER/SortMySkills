"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import gsap from "gsap";
import { ArrowRight, Compass, CheckCircle, Search, Layers, Clipboard, HelpCircle } from "lucide-react";

// Mock normalization registry
const SKILL_MAP: Record<string, string> = {
  react: "React", "react.js": "React", reactjs: "React", "react native": "React",
  js: "JavaScript", javascript: "JavaScript", es6: "JavaScript",
  ts: "TypeScript", typescript: "TypeScript",
  py: "Python", python: "Python", python3: "Python",
  ml: "Machine Learning", machinelearning: "Machine Learning", "deep learning": "Machine Learning", "deeplearning": "Machine Learning",
  ds: "Data Science", datascience: "Data Science", pandas: "Data Science", numpy: "Data Science",
  ux: "UX Design", figma: "UX Design", uiux: "UX Design", "ui/ux": "UX Design", "product design": "UX Design",
  pm: "Product Management", "product management": "Product Management", agile: "Product Management", scrum: "Product Management",
  tailwind: "Tailwind CSS", tailwindcss: "Tailwind CSS", css: "Tailwind CSS",
  node: "Node.js", nodejs: "Node.js", "node.js": "Node.js",
  sql: "SQL", postgresql: "SQL", mysql: "SQL", sqlquery: "SQL",
  git: "Git", github: "Git"
};

const COURSERA_COURSES = [
  {
    title: "Meta Front-End Developer Professional Certificate",
    skills: ["React", "JavaScript", "Tailwind CSS", "Git"],
    difficulty: "Beginner",
    duration: "4 Months",
    relevance: "High demand across SaaS, eCommerce, and tech startups."
  },
  {
    title: "Google Data Analytics Professional Certificate",
    skills: ["SQL", "Python", "Data Science"],
    difficulty: "Beginner",
    duration: "6 Months",
    relevance: "Essential for metrics analysis, product ops, and financial modeling."
  },
  {
    title: "Deep Learning Specialization — DeepLearning.AI",
    skills: ["Python", "Machine Learning"],
    difficulty: "Intermediate",
    duration: "5 Months",
    relevance: "Prerequisite for neural architecture, NLP models, and AI development."
  },
  {
    title: "Google UX Design Professional Certificate",
    skills: ["UX Design", "Figma"],
    difficulty: "Beginner",
    duration: "6 Months",
    relevance: "Core wireframing, heuristic testing, and product planning."
  },
  {
    title: "Brand Management Specialization — University of London",
    skills: ["Product Management"],
    difficulty: "Intermediate",
    duration: "3 Months",
    relevance: "Product life cycle, marketing architecture, and positioning."
  }
];

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [extractedTags, setExtractedTags] = useState<string[]>(["React", "TypeScript", "Figma"]);
  
  // Hero dynamic typewriter tags
  const [heroRawInput, setHeroRawInput] = useState("reactjs, py, figma design, javascript, PM");
  const [heroNormalized, setHeroNormalized] = useState<string[]>([]);
  const [isProcessingHero, setIsProcessingHero] = useState(false);

  // Refs for animations
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroDemoRef = useRef<HTMLDivElement>(null);
  const path1Ref = useRef<HTMLDivElement>(null);
  const path2Ref = useRef<HTMLDivElement>(null);

  // Initial animations
  useEffect(() => {
    // Intro animation for Hero
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" }
      );

      gsap.fromTo(
        heroDemoRef.current,
        { opacity: 0, scale: 0.97, x: 20 },
        { opacity: 1, scale: 1, x: 0, duration: 1, delay: 0.4, ease: "power2.out" }
      );

      // Scroll trigger style entry for cards
      gsap.fromTo(
        [path1Ref.current, path2Ref.current],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.6, ease: "power2.out" }
      );
    });

    return () => ctx.revert();
  }, []);

  // Demo auto-sorting sequence in Hero
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const runDemo = () => {
      setIsProcessingHero(true);
      timeout = setTimeout(() => {
        const rawArray = heroRawInput.split(",").map((s) => s.trim().toLowerCase());
        const resolved: string[] = [];
        rawArray.forEach((raw) => {
          // Look for direct match or partial match in dictionary keys
          Object.keys(SKILL_MAP).forEach((key) => {
            if (raw.includes(key) && !resolved.includes(SKILL_MAP[key])) {
              resolved.push(SKILL_MAP[key]);
            }
          });
        });
        setHeroNormalized(resolved);
        setIsProcessingHero(false);
        
        // GSAP tag pop animation
        gsap.fromTo(
          ".demo-tag",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.7)" }
        );
      }, 1200);
    };

    runDemo();

    // Loop demo text changes periodically
    const textOptions = [
      "reactjs, py, figma design, javascript, PM",
      "node.js, postgresql, git-command, typescript",
      "tailwindcss, deep learning, python3, agile"
    ];
    let optionIndex = 0;

    const interval = setInterval(() => {
      optionIndex = (optionIndex + 1) % textOptions.length;
      setHeroRawInput(textOptions[optionIndex]);
      setHeroNormalized([]);
      // Trigger update
      setIsProcessingHero(true);
      setTimeout(() => {
        const rawArray = textOptions[optionIndex].split(",").map((s) => s.trim().toLowerCase());
        const resolved: string[] = [];
        rawArray.forEach((raw) => {
          Object.keys(SKILL_MAP).forEach((key) => {
            if (raw.includes(key) && !resolved.includes(SKILL_MAP[key])) {
              resolved.push(SKILL_MAP[key]);
            }
          });
        });
        setHeroNormalized(resolved);
        setIsProcessingHero(false);
        
        gsap.fromTo(
          ".demo-tag",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.7)" }
        );
      }, 1000);
    }, 8000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [heroRawInput]);

  // Handle manual interactive parsing
  const handleParseSkills = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const tokens = inputText.toLowerCase().split(/[,\s\n]+/).map(t => t.trim());
    const matched: string[] = [];

    tokens.forEach((token) => {
      // Direct matches
      if (SKILL_MAP[token]) {
        if (!matched.includes(SKILL_MAP[token])) {
          matched.push(SKILL_MAP[token]);
        }
      } else {
        // Substring matching
        Object.keys(SKILL_MAP).forEach((key) => {
          if (token.includes(key) || key.includes(token)) {
            if (!matched.includes(SKILL_MAP[key]) && token.length > 1) {
              matched.push(SKILL_MAP[key]);
            }
          }
        });
      }
    });

    if (matched.length > 0) {
      setExtractedTags(matched);
      gsap.fromTo(
        ".manual-tag",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    } else {
      // Default fallback
      setExtractedTags(["No Standard Tag Detected"]);
    }
  };

  // Hover animations for pathway cards
  const handlePathHover = (el: HTMLDivElement | null, accentColor: string) => {
    if (!el) return;
    gsap.to(el, {
      borderColor: accentColor,
      backgroundColor: "rgba(20, 20, 19, 0.6)",
      y: -4,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handlePathLeave = (el: HTMLDivElement | null) => {
    if (!el) return;
    gsap.to(el, {
      borderColor: "rgba(244, 244, 243, 0.06)",
      backgroundColor: "transparent",
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  return (
    <div className="min-h-screen relative dot-grid-overlay bg-bg-dark text-text-primary">
      {/* Top Navbar */}
      <Navbar />

      {/* Grid Overlay background aesthetic */}
      <div className="absolute inset-0 grid-bg-overlay pointer-events-none z-0 opacity-40" />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Asymmetrical Left Side: Text and Editorial Framing */}
          <div ref={heroTextRef} className="lg:col-span-7 flex flex-col justify-center pr-0 lg:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-card fine-line mb-6 w-fit rounded-none">
              <span className="mono-tag text-accent-green">RELEASE V1.0.4</span>
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full" />
              <span className="mono-tag text-text-secondary">CAREER TAXONOMY INDEX</span>
            </div>
            
            <h1 className="hero-fade text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-6">
              Learn <span className="text-serif italic font-normal text-accent-cyan">intentionally</span>.<br />
              Audit your gaps. Align with market realities.
            </h1>

            <p className="hero-fade text-base text-text-secondary max-w-xl leading-relaxed mb-8">
              Students waste months taking generic courses that don't match target roles. 
              <span className="text-text-primary"> SortMySkills</span> breaks down chaotic resumes and job 
              descriptions into verified technical tags, matching your missing skills directly 
              against curated study roadmaps.
            </p>

            <div className="hero-fade flex flex-wrap gap-4 items-center">
              <Link
                href="/skill-development"
                className="px-6 py-3 bg-accent-green text-bg-dark font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 hover:bg-accent-cyan hover:scale-[1.02]"
              >
                1. Build Skill Roadmap
              </Link>
              <Link
                href="/job-match"
                className="px-6 py-3 bg-transparent fine-line text-text-primary font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:bg-surface-card hover:border-text-secondary"
              >
                2. Audit Resume vs JD
              </Link>
            </div>

            {/* Custom high-end metadata grid under description */}
            <div className="hero-fade grid grid-cols-3 gap-6 pt-12 mt-12 fine-border-t">
              <div>
                <span className="block text-[10px] font-mono text-text-secondary uppercase tracking-widest">NORMALIZED TAXONOMIES</span>
                <span className="block text-2xl font-light mt-1 text-text-primary">150+ Tags</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-text-secondary uppercase tracking-widest">CURATED DIRECTORY</span>
                <span className="block text-2xl font-light mt-1 text-text-primary">40+ Courses</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-text-secondary uppercase tracking-widest">MATCH PRECISION</span>
                <span className="block text-2xl font-light mt-1 text-text-primary">Local NLP</span>
              </div>
            </div>
          </div>

          {/* Asymmetrical Right Side: Satisfying Live Normalization Simulator */}
          <div ref={heroDemoRef} className="lg:col-span-5 flex items-stretch">
            <div className="w-full bg-surface-card/65 backdrop-blur-sm fine-line p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-cyan/5 to-transparent pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between pb-4 fine-border-b mb-6">
                  <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">LIVE COMPILING ENVIRONMENT</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-accent-cyan rounded-full animate-ping" />
                    <span className="text-[9px] font-mono text-accent-cyan">ACTIVE ENGINE</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Raw input simulated block */}
                  <div>
                    <label className="block text-[10px] font-mono text-text-secondary uppercase mb-2">RAW SKILL STRINGS (INPUT)</label>
                    <div className="w-full bg-bg-dark/90 fine-line p-3 font-mono text-xs text-accent-green/85 min-h-[60px] flex items-center">
                      <span className="animate-pulse mr-1">&gt;</span> {heroRawInput}
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center my-1 text-text-secondary">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-mono text-text-secondary mb-1">NORMALIZING STRINGS</span>
                      <div className="h-6 w-[1px] bg-accent-cyan/30" />
                    </div>
                  </div>

                  {/* Normalized outputs */}
                  <div>
                    <label className="block text-[10px] font-mono text-text-secondary uppercase mb-2">NORMALIZED CAREER TAGS (OUTPUT)</label>
                    <div className="w-full bg-bg-dark/50 fine-line p-4 min-h-[110px] flex flex-wrap gap-2 items-content-start">
                      {isProcessingHero ? (
                        <div className="w-full flex items-center justify-center h-full py-6 text-text-secondary text-[11px] font-mono">
                          <span className="animate-spin mr-2">/</span> EXTRACTING TOKENS...
                        </div>
                      ) : (
                        heroNormalized.map((tag, idx) => (
                          <span
                            key={idx}
                            className="demo-tag inline-flex items-center gap-1.5 px-3 py-1 bg-surface-hover fine-line text-text-primary text-[11px] font-mono hover:border-accent-cyan transition-all"
                          >
                            <span className="w-1.5 h-1.5 bg-accent-cyan rounded-none" />
                            {tag}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 fine-border-t flex items-center justify-between text-text-secondary text-[10px] font-mono">
                <span>INDEX VERSION: 2.1</span>
                <span>STATUS: STABLE</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Pathways Portal Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative fine-border-t">
        <div className="mb-12">
          <span className="block text-[11px] font-mono text-accent-green uppercase tracking-widest mb-2">PRODUCT STRUCTURE</span>
          <h2 className="text-3xl font-light text-text-primary">Two Connected Pathways</h2>
          <p className="text-text-secondary text-sm max-w-xl mt-2">
            SortMySkills operates through two distinct analytical modules designed to replace vague advice with tangible actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pathway 1: Skill Development Card */}
          <div
            ref={path1Ref}
            onMouseEnter={() => handlePathHover(path1Ref.current, "#3be87e")}
            onMouseLeave={() => handlePathLeave(path1Ref.current)}
            className="p-8 border fine-line bg-transparent flex flex-col justify-between transition-all duration-300 relative group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 bg-accent-green/5 flex items-center justify-center fine-line mb-8 group-hover:bg-accent-green/10 transition-colors">
                <Compass className="w-5 h-5 text-accent-green" />
              </div>
              <span className="mono-tag text-accent-green block mb-2">MODULE 01</span>
              <h3 className="text-2xl font-light mb-4 text-text-primary group-hover:text-accent-green transition-colors">
                Skill Development
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                Map your current competencies against standard blueprints for critical industry roles. Detect missing layers, see your mathematical readiness score, and get a sequential study path.
              </p>
              <ul className="space-y-2 mb-8 text-xs font-mono text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent-green rounded-full" /> Target Role Selection Profile
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent-green rounded-full" /> Readiness Percentage Charting
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent-green rounded-full" /> Chronological Study Roadmap
                </li>
              </ul>
            </div>
            <Link
              href="/skill-development"
              className="inline-flex items-center gap-2 text-xs font-mono text-accent-green uppercase tracking-wider group-hover:translate-x-1.5 transition-transform"
            >
              Analyze Career Path <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pathway 2: Job Match Analysis Card */}
          <div
            ref={path2Ref}
            onMouseEnter={() => handlePathHover(path2Ref.current, "#1ad1d7")}
            onMouseLeave={() => handlePathLeave(path2Ref.current)}
            className="p-8 border fine-line bg-transparent flex flex-col justify-between transition-all duration-300 relative group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 bg-accent-cyan/5 flex items-center justify-center fine-line mb-8 group-hover:bg-accent-cyan/10 transition-colors">
                <Layers className="w-5 h-5 text-accent-cyan" />
              </div>
              <span className="mono-tag text-accent-cyan block mb-2">MODULE 02</span>
              <h3 className="text-2xl font-light mb-4 text-text-primary group-hover:text-accent-cyan transition-colors">
                Job Match Analysis
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                Compare your actual resume against the exact text of a job description. The parser extracts required tags, normalizes them, filters your assets, and exposes gaps.
              </p>
              <ul className="space-y-2 mb-8 text-xs font-mono text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent-cyan rounded-full" /> Dual Panel Resume & JD Parser
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent-cyan rounded-full" /> Exact Gap Mapping System
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent-cyan rounded-full" /> Targeted Course Recommended Lists
                </li>
              </ul>
            </div>
            <Link
              href="/job-match"
              className="inline-flex items-center gap-2 text-xs font-mono text-accent-cyan uppercase tracking-wider group-hover:translate-x-1.5 transition-transform"
            >
              Run JD Comparison <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Core Parser Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative fine-border-t">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5">
            <span className="block text-[11px] font-mono text-accent-cyan uppercase tracking-widest mb-2">ENGINE TESTBENCH</span>
            <h2 className="text-3xl font-light text-text-primary leading-tight">
              Test the Standardizing Parser
            </h2>
            <p className="text-text-secondary text-sm mt-4 leading-relaxed">
              Vague skill labels like <code>reactjs</code>, <code>React.js</code>, and <code>react libraries</code> dilute search scores. Paste a list of tech tools below to see our local engine scan and standardize them immediately.
            </p>

            <form onSubmit={handleParseSkills} className="mt-8 space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-text-secondary uppercase mb-2">INPUT CHAOTIC TECH TEXT</label>
                <textarea
                  className="w-full bg-surface-card fine-line p-3 text-xs font-mono text-text-primary h-28 focus:outline-none focus:border-accent-cyan rounded-none"
                  placeholder="e.g. I did coding in React.js, styled with Tailwind CSS, used javascript for backend node.js and stored data on SQL"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-text-primary text-bg-dark font-mono text-xs uppercase tracking-wider font-bold hover:bg-accent-cyan hover:text-bg-dark transition-all duration-300"
              >
                Normalize Tokens
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-surface-card/40 fine-line p-8 min-h-[300px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 fine-border-b mb-6 text-[10px] font-mono text-text-secondary">
                <span>PARSED NODE BLUEPRINT</span>
                <span>SYSTEM LOCAL: PARSING OK</span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-[9px] font-mono text-text-secondary uppercase mb-1">NORMALIZED TAG CLUSTER</span>
                  <div className="flex flex-wrap gap-2.5 p-4 bg-bg-dark/40 fine-line min-h-[80px] items-content-start">
                    {extractedTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="manual-tag inline-flex items-center gap-1.5 px-3 py-1 bg-surface-hover fine-line text-[11px] font-mono text-accent-cyan font-medium"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-accent-green" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] font-mono text-text-secondary uppercase mb-1.5">COURSE CATEGORY ALLOCATIONS</span>
                  <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-text-secondary">
                    <div className="p-3 bg-bg-dark/25 fine-line">
                      <span className="block text-accent-green text-[9px] uppercase tracking-wider">PRIMARY DISCIPLINE</span>
                      <span className="block text-text-primary text-xs mt-1">
                        {extractedTags.includes("React") || extractedTags.includes("Tailwind CSS") ? "Frontend Engineering" : "General Technology"}
                      </span>
                    </div>
                    <div className="p-3 bg-bg-dark/25 fine-line">
                      <span className="block text-accent-cyan text-[9px] uppercase tracking-wider">BLUEPRINT ALIGNMENT</span>
                      <span className="block text-text-primary text-xs mt-1">
                        {extractedTags.length > 2 ? "High Alignment" : "Partial Alignment"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 fine-border-t flex items-center justify-between text-[9px] font-mono text-text-secondary">
              <span>SCAN SPEED: &lt; 2MS</span>
              <span>INDEX: V2.1_GLOBAL</span>
            </div>
          </div>

        </div>
      </section>

      {/* Coursera Course Recommendations Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative fine-border-t">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="block text-[11px] font-mono text-accent-green uppercase tracking-widest mb-2">CURATED CLASSROOM</span>
            <h2 className="text-3xl font-light text-text-primary">Curated Coursera Recommendations</h2>
            <p className="text-text-secondary text-sm max-w-xl mt-2">
              We bypass speculative course lists. Below is our curated index of high-fidelity, industry-recognized certificates mapped directly to detected skill gaps.
            </p>
          </div>
          <Link
            href="/skill-development"
            className="text-xs font-mono text-accent-green uppercase tracking-wider hover:underline flex items-center gap-1 shrink-0"
          >
            Open Skill Planner <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Compact asymmetrical layout for course list */}
        <div className="space-y-4">
          {COURSERA_COURSES.map((course, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5 bg-surface-card/30 fine-line hover:bg-surface-card/65 hover:border-text-secondary/40 transition-all duration-300 items-center rounded-none"
            >
              {/* Course Title and Difficulty */}
              <div className="lg:col-span-5">
                <span className="inline-block px-2 py-0.5 bg-bg-dark fine-line text-text-secondary font-mono text-[9px] uppercase tracking-wider mb-2">
                  {course.difficulty}
                </span>
                <h4 className="text-base text-text-primary font-normal leading-snug">
                  {course.title}
                </h4>
              </div>

              {/* Taught skills */}
              <div className="lg:col-span-3 flex flex-wrap gap-1.5">
                {course.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 bg-surface-hover fine-line text-text-secondary font-mono text-[10px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Duration & Value */}
              <div className="lg:col-span-3">
                <span className="block text-[10px] font-mono text-text-secondary uppercase tracking-widest">CAREER PATH VALUE</span>
                <span className="block text-xs text-text-secondary leading-normal mt-0.5">
                  {course.relevance}
                </span>
              </div>

              {/* Direct Arrow / Study portal placeholder */}
              <div className="lg:col-span-1 flex justify-end">
                <div className="w-8 h-8 rounded-none fine-line bg-bg-dark flex items-center justify-center text-text-secondary hover:text-accent-green hover:border-accent-green transition-all cursor-pointer">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Philosophy Editorial Section */}
      <section id="philosophy" className="py-24 px-6 max-w-7xl mx-auto z-10 relative fine-border-t">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Asymmetric Left side: Large Quote text */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <span className="block text-[11px] font-mono text-accent-green uppercase tracking-widest mb-2">OUR MANIFESTO</span>
            <h2 className="text-3xl sm:text-4xl text-serif italic font-normal text-accent-cyan leading-tight pr-4">
              “Direction is fundamentally more valuable than learning volume.”
            </h2>
            <div className="mt-8 text-xs font-mono text-text-secondary space-y-1">
              <p>SORTMYSKILLS PLATFORM ESSAY</p>
              <p>WRITTEN BY HARSH & THE DEV TEAM</p>
              <p>PUBLISHED MAY 2026</p>
            </div>
          </div>

          {/* Asymmetric Right side: Dense editorial columns */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-text-secondary leading-relaxed font-light">
            <div className="space-y-6">
              <p>
                <span className="text-4xl font-normal text-text-primary text-serif float-left mr-2.5 mt-1 leading-[0.8]">T</span>
                he online education market is bloated with a tragic paradox. Today's students have infinite access to course lectures, coding bootcamps, and specialized credentials. Yet, early-career job applicants have never felt more disconnected from the demands of real hiring managers.
              </p>
              <p>
                This misalignment exists because students learn randomly. They pursue skills based on what is recommended by generic marketplace algorithms or what is trending on tech forums. A student might master Django and Ruby, only to apply for front-end React roles, wondering why their resume gets immediately filtered out by algorithmic scanners.
              </p>
              <p>
                At <span className="text-text-primary">SortMySkills</span>, we believe intelligence is not about generating fake AI statements or optimistic landing page slogans. It is about transparency, structure, and taxonomy normalization.
              </p>
            </div>
            
            <div className="space-y-6">
              <p>
                When a recruiter writes a job description, they specify strict technical tags. If your resume lists those tags using non-standard wording, or misses them entirely because you spent months learning adjacent but non-essential frameworks, you are mathematically locked out of the race.
              </p>
              <p>
                Our platform provides a clean, manual-grade parsing laboratory. By extracting key skill tokens from your resume and comparing them side-by-side with genuine job descriptions, we highlight precisely where your profile falls short.
              </p>
              <p>
                We do not sell you proprietary courses. Instead, we map your verified skill gaps directly to curated Coursera certificates that are recognized worldwide. We invite you to stop browsing blindly, audit your skills systematically, and learn with absolute intent.
              </p>
              <div className="pt-6">
                <Link
                  href="/skill-development"
                  className="px-6 py-2.5 bg-accent-green text-bg-dark font-mono text-[11px] uppercase tracking-wider font-bold inline-flex items-center gap-1.5 hover:bg-accent-cyan transition-colors"
                >
                  Map Your Capabilities <Compass className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 px-6 max-w-7xl mx-auto z-10 relative fine-border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-mono text-text-secondary">
          <div className="flex items-center gap-3">
            <Logo className="w-5 h-5 opacity-60" />
            <span>SORTMYSKILLS © 2026. STRUCTURED STUDY DIRECTORY.</span>
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/skill-development" className="hover:text-text-primary transition-colors">SKILL DEVELOPMENT</Link>
            <Link href="/job-match" className="hover:text-text-primary transition-colors">JOB MATCH ANALYSIS</Link>
            <a href="https://www.coursera.org" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">COURSERA DIRECTORY</a>
          </div>

          <div>
            <span>MADE IN PAIR PROGRAMMING</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
