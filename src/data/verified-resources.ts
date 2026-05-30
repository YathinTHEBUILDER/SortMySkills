export interface VerifiedResource {
  name: string;
  url: string;
  platform: string;
  skills: string[];
  is_free: boolean;
}

export const VERIFIED_RESOURCES: VerifiedResource[] = [
  {
    name: "The Odin Project",
    url: "https://www.theodinproject.com/",
    platform: "The Odin Project",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git", "Node.js"],
    is_free: true,
  },
  {
    name: "freeCodeCamp Responsive Web Design",
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
    platform: "freeCodeCamp",
    skills: ["HTML", "CSS", "Responsive Design"],
    is_free: true,
  },
  {
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org/",
    platform: "MDN",
    skills: ["HTML", "CSS", "JavaScript", "Web APIs", "TypeScript"],
    is_free: true,
  },
  {
    name: "React Official Docs",
    url: "https://react.dev/learn",
    platform: "React Docs",
    skills: ["React"],
    is_free: true,
  },
  {
    name: "Next.js Official Learn",
    url: "https://nextjs.org/learn",
    platform: "Next.js",
    skills: ["Next.js", "React"],
    is_free: true,
  },
  {
    name: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/",
    platform: "TypeScript Docs",
    skills: ["TypeScript"],
    is_free: true,
  },
  {
    name: "Python for Everybody",
    url: "https://www.py4e.com/",
    platform: "PY4E",
    skills: ["Python"],
    is_free: true,
  },
  {
    name: "CS50x",
    url: "https://cs50.harvard.edu/x/",
    platform: "Harvard CS50",
    skills: ["Computer Science", "C", "Python", "SQL"],
    is_free: true,
  },
  {
    name: "SQLBolt",
    url: "https://sqlbolt.com/",
    platform: "SQLBolt",
    skills: ["SQL"],
    is_free: true,
  },
  {
    name: "Kaggle Learn",
    url: "https://www.kaggle.com/learn",
    platform: "Kaggle",
    skills: ["Python", "Data Science", "Machine Learning", "Pandas", "NumPy"],
    is_free: true,
  },
  {
    name: "Google Machine Learning Crash Course",
    url: "https://developers.google.com/machine-learning/crash-course",
    platform: "Google Developers",
    skills: ["Machine Learning", "TensorFlow"],
    is_free: true,
  },
  {
    name: "Docker Get Started",
    url: "https://docs.docker.com/get-started/",
    platform: "Docker Docs",
    skills: ["Docker", "DevOps"],
    is_free: true,
  },
  {
    name: "GitHub Skills",
    url: "https://skills.github.com/",
    platform: "GitHub Skills",
    skills: ["Git", "GitHub"],
    is_free: true,
  },
  {
    name: "roadmap.sh",
    url: "https://roadmap.sh/",
    platform: "roadmap.sh",
    skills: ["Frontend", "Backend", "DevOps", "React", "Node.js", "JavaScript", "TypeScript"],
    is_free: true,
  },
];

/** Set of all verified resource URLs for quick lookup */
const VERIFIED_URL_SET = new Set(VERIFIED_RESOURCES.map((r) => r.url));

/**
 * Returns verified resources relevant to the given skill names.
 * Matching is case-insensitive.
 */
export function getRelevantResources(skills: string[]): VerifiedResource[] {
  const lowerSkills = skills.map((s) => s.toLowerCase());
  return VERIFIED_RESOURCES.filter((r) =>
    r.skills.some((rs) => lowerSkills.includes(rs.toLowerCase()))
  );
}

/**
 * Checks if a URL is in the verified resource list.
 */
export function isVerifiedUrl(url: string): boolean {
  return VERIFIED_URL_SET.has(url);
}

/**
 * Finds the best matching verified resource for a given URL or skill name.
 * Returns the resource if found, or undefined.
 */
export function findVerifiedResource(url?: string, skillName?: string): VerifiedResource | undefined {
  if (url && VERIFIED_URL_SET.has(url)) {
    return VERIFIED_RESOURCES.find((r) => r.url === url);
  }
  if (skillName) {
    const lower = skillName.toLowerCase();
    return VERIFIED_RESOURCES.find((r) =>
      r.skills.some((s) => s.toLowerCase() === lower) ||
      r.name.toLowerCase().includes(lower)
    );
  }
  return undefined;
}

export function normalizeResourceText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function matchVerifiedResource(input: {
  name?: string;
  url?: string;
  platform?: string;
}): VerifiedResource | undefined {
  // 1. exact URL match
  if (input.url) {
    const matched = VERIFIED_RESOURCES.find((r) => r.url === input.url);
    if (matched) return matched;
  }
  // 2. exact normalized name match
  if (input.name) {
    const normalizedInputName = normalizeResourceText(input.name);
    const matched = VERIFIED_RESOURCES.find((r) => normalizeResourceText(r.name) === normalizedInputName);
    if (matched) return matched;
  }
  // 3. exact normalized platform + name match
  if (input.platform && input.name) {
    const combinedInput = normalizeResourceText(`${input.platform} ${input.name}`);
    const matched = VERIFIED_RESOURCES.find((r) => normalizeResourceText(`${r.platform} ${r.name}`) === combinedInput);
    if (matched) return matched;
  }
  return undefined;
}
