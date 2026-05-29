"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ResumeContextType {
  resume: string;
  setResume: (val: string) => void;
  jd: string;
  setJd: (val: string) => void;
  resumeText: string;
  setResumeText: (val: string) => void;
  jdText: string;
  setJdText: (val: string) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resume, setResumeInternal] = useState("");
  const [jd, setJdInternal] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedResume = localStorage.getItem("sortmyskills_resumeText") || localStorage.getItem("sortmyskills_resume");
      const storedJd = localStorage.getItem("sortmyskills_jdText") || localStorage.getItem("sortmyskills_jd");
      if (storedResume) {
        setResumeInternal(storedResume);
      }
      if (storedJd) {
        setJdInternal(storedJd);
      }
    }
  }, []);

  const setResume = (val: string) => {
    setResumeInternal(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("sortmyskills_resumeText", val);
      localStorage.setItem("sortmyskills_resume", val);
    }
  };

  const setJd = (val: string) => {
    setJdInternal(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("sortmyskills_jdText", val);
      localStorage.setItem("sortmyskills_jd", val);
    }
  };

  const value = {
    resume,
    setResume,
    jd,
    setJd,
    resumeText: resume,
    setResumeText: setResume,
    jdText: jd,
    setJdText: setJd,
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
