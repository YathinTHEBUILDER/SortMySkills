export type ProficiencyLevel = "beginner" | "moderate" | "expert" | "unspecified";

export interface DetectedSkill {
  canonical: string;
  level: ProficiencyLevel;
  matchedTokens: string[];
}

export interface TokenTrace {
  token: string;
  hit: boolean;
  canonical?: string;
  skipReason?: string;
}

export interface ParseResult {
  skills: DetectedSkill[];
  discipline: string | null;
  tokenTrace: TokenTrace[];
}

export const SKILL_MAP: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  es6: "JavaScript",
  vanilla: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  react: "React",
  reactjs: "React",
  "react.js": "React",
  "react native": "React",
  next: "Next.js",
  nextjs: "Next.js",
  "next.js": "Next.js",
  vue: "Vue.js",
  vuejs: "Vue.js",
  "vue.js": "Vue.js",
  angular: "Angular",
  angularjs: "Angular",
  svelte: "Svelte",
  html: "HTML",
  html5: "HTML",
  css: "CSS",
  css3: "CSS",
  scss: "CSS",
  sass: "CSS",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  graphql: "GraphQL",
  gql: "GraphQL",
  apollo: "GraphQL",
  node: "Node.js",
  nodejs: "Node.js",
  "node.js": "Node.js",
  express: "Express.js",
  expressjs: "Express.js",
  jest: "Testing",
  cypress: "Testing",
  selenium: "Testing",
  webpack: "Webpack",
  vite: "Vite",
  py: "Python",
  python: "Python",
  python3: "Python",
  django: "Django",
  flask: "Flask",
  fastapi: "FastAPI",
  pandas: "Data Science",
  numpy: "Data Science",
  tensorflow: "Machine Learning",
  tf: "Machine Learning",
  pytorch: "Machine Learning",
  sklearn: "Machine Learning",
  "scikit-learn": "Machine Learning",
  sklearnprotected: "Machine Learning",
  java: "Java",
  "c#": "C#",
  csharp: "C#",
  dotnet: ".NET",
  ".net": ".NET",
  cpp: "C++",
  "c++": "C++",
  go: "Go",
  golang: "Go",
  rust: "Rust",
  ruby: "Ruby",
  php: "PHP",
  swift: "Swift",
  kotlin: "Kotlin",
  scala: "Scala",
  r: "R",
  sql: "SQL",
  postgresql: "SQL",
  postgres: "SQL",
  mysql: "SQL",
  sqlite: "SQL",
  mongodb: "MongoDB",
  mongo: "MongoDB",
  nosql: "MongoDB",
  redis: "Redis",
  elasticsearch: "Elasticsearch",
  dynamodb: "AWS",
  aws: "AWS",
  ec2: "AWS",
  s3: "AWS",
  lambda: "AWS",
  "amazon web services": "AWS",
  gcp: "Google Cloud",
  firebase: "Google Cloud",
  "google cloud": "Google Cloud",
  azure: "Azure",
  docker: "DevOps",
  kubernetes: "DevOps",
  k8s: "DevOps",
  devops: "DevOps",
  ci: "DevOps",
  cd: "DevOps",
  "ci/cd": "DevOps",
  terraform: "DevOps",
  linux: "Linux",
  bash: "Linux",
  git: "Git",
  github: "Git",
  gitlab: "Git",
  ml: "Machine Learning",
  "machine learning": "Machine Learning",
  machinelearning: "Machine Learning",
  "deep learning": "Machine Learning",
  deeplearning: "Machine Learning",
  dl: "Machine Learning",
  ai: "Machine Learning",
  "artificial intelligence": "Machine Learning",
  ds: "Data Science",
  "data science": "Data Science",
  datascience: "Data Science",
  tableau: "Data Science",
  powerbi: "Data Science",
  "power bi": "Data Science",
  figma: "Figma",
  ux: "UX Design",
  "ui/ux": "UX Design",
  uiux: "UX Design",
  "ux design": "UX Design",
  "ui design": "UX Design",
  sketch: "UX Design",
  pm: "Product Management",
  "product management": "Product Management",
  agile: "Product Management",
  scrum: "Product Management",
  jira: "Product Management",
  rest: "REST APIs",
  "rest api": "REST APIs",
  restful: "REST APIs",
  "restful api": "REST APIs",
  dsa: "DSA",
  "data structures": "DSA",
  algorithms: "DSA",
  "unit testing": "Testing",
  microservices: "Microservices",
  websocket: "WebSockets",
  websockets: "WebSockets",
  spring: "Spring",
  "ruby on rails": "Ruby",
  rails: "Ruby",
};

const MULTI_WORD_PHRASES = [
  "amazon web services",
  "artificial intelligence",
  "machine learning",
  "deep learning",
  "data science",
  "unit testing",
  "data structures",
  "ruby on rails",
  "scikit-learn",
  "google cloud",
  "restful api",
  "rest api",
  "ux design",
  "ui design",
  "power bi",
  "next.js",
  "node.js",
  "react.js",
  "vue.js",
  "ci/cd",
  "ui/ux",
].sort((a, b) => b.length - a.length);

const STOPWORDS = new Set(
  [
    "i", "im", "ive", "a", "an", "the", "and", "or", "but", "for", "in", "on", "at", "to", "of", "with", "by", "as",
    "is", "are", "was", "were", "be", "been", "have", "has", "had", "do", "does", "did", "will", "would", "can",
    "could", "should", "may", "might", "shall", "must", "my", "your", "their", "our", "we", "you", "they", "he",
    "she", "it", "this", "that", "these", "those", "not", "no", "nor", "so", "yet", "both", "either", "each", "few",
    "more", "most", "other", "some", "such", "how", "when", "where", "who", "which", "what", "all", "any", "from",
    "into", "through", "during", "about", "before", "after", "above", "below", "then", "than", "if", "else", "while",
    "though", "although", "because", "since", "until", "unless", "also", "just", "even", "only", "very", "too",
    "well", "back", "now", "good", "great", "work", "strong", "knowledge", "skills", "skill", "experience", "ability",
    "looking", "seeking", "required", "preferred", "plus", "nice", "bonus", "help", "team", "within", "across",
    "excellent", "demonstrated", "proven", "solid", "deep", "working", "minimum", "hands", "using", "use", "make",
    "get", "give", "set", "let", "end", "role", "need", "needs", "daily", "weekly", "basis", "job", "company",
    "position", "candidate", "applicant", "responsibilities", "qualifications", "requirements", "including", "etc",
    "eg", "ie", "like", "similar", "related", "relevant", "various", "multiple", "different", "several", "many",
    "best", "new", "old", "high", "low", "large", "small", "number", "type", "level", "key", "core", "main",
    "primary", "secondary", "additional", "future", "current", "existing", "following", "listed", "given", "needed",
    "necessary", "important", "critical", "essential", "ideal", "desired", "big", "long", "short", "wide", "own",
    "full", "real", "right", "next", "last", "first", "second", "third", "lead", "leads", "leading", "led", "worked",
    "build", "building", "built", "develop", "developing", "developed", "create", "creating", "created", "design",
    "designing", "designed", "implement", "implementing", "implemented", "maintain", "maintaining", "maintained",
    "module", "script", "run", "runs", "running", "process", "system", "service", "services", "platform", "tool",
    "tools", "write", "writing", "written", "code", "coding", "test", "tests", "testing", "feature", "features",
    "data", "model", "models", "manage", "management", "version", "performance", "teams", "product", "products",
    "plan", "planning", "delivery", "deliver", "software", "application", "applications", "solution", "solutions",
    "project", "projects", "client", "clients", "business", "businesses", "user", "users", "value", "values",
    "output", "outputs", "input", "inputs", "function", "functions", "method", "methods", "class", "classes",
    "object", "objects", "variable", "variables", "framework", "frameworks", "library", "libraries", "language",
    "languages", "pattern", "patterns", "concept", "concepts", "practice", "practices", "principle", "principles",
    "approach", "done", "doing", "made", "making", "able", "allows", "allow", "uses", "cross", "year", "month",
    "week", "day", "time", "times", "shell", "said", "rain", "main", "email", "train", "domain", "said",
  ].map((w) => w.toLowerCase())
);

const BEGINNER_SIGNALS = [
  "beginner at", "beginner in", "beginner", "new to", "newbie", "just started", "starting out", "novice",
  "familiar with", "basic knowledge", "basic understanding", "some exposure", "exposure to", "introductory",
  "intro to", "entry level", "entry-level", "just learning", "currently learning", "getting started",
  "getting into", "picking up", "studying", "trying to learn", "not much experience", "limited experience",
  "little experience", "no professional experience", "junior", "basic", "learning", "new to",
];

const MODERATE_SIGNALS = [
  "some experience", "working knowledge", "hands-on", "practical experience", "decent knowledge",
  "solid understanding", "good understanding", "regularly use", "day-to-day", "1-2 years", "couple of years",
  "a few years", "moderately", "moderate", "proficient in", "proficient with", "proficient", "comfortable with",
  "familiar", "decent", "intermediate", "1 year", "2 years",
];

const EXPERT_SIGNALS = [
  "expert-level", "expert in", "expert", "advanced knowledge", "advanced", "senior", "5+ years", "6+ years",
  "7+ years", "8+ years", "10+ years", "deep expertise", "extensive experience", "mastery", "extensively",
  "specialist", "architect", "principal", "seasoned", "highly skilled", "strong proficiency",
  "years of experience", "3+ years", "4+ years", "5 years", "6 years", "7 years", "8 years",
  "production experience", "shipped", "built in production", "designed and built", "owned", "led", "lead",
];

const JD_MODERATE_SIGNALS = [
  "required", "must have", "must-have", "essential", "minimum", "at least", "years of experience",
  "proficiency required", "expertise required",
];

const DISCIPLINE_BUCKETS: Record<string, string[]> = {
  Frontend: [
    "React", "Vue.js", "Angular", "Svelte", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS",
    "Next.js", "Vite", "Webpack",
  ],
  Backend: [
    "Node.js", "Express.js", "Python", "Java", "Go", "PHP", "Ruby", "Django", "Flask", "FastAPI", "Spring",
    "SQL", "MongoDB", "Redis", "Elasticsearch", ".NET", "C#", "Microservices", "REST APIs", "WebSockets",
  ],
  "Data & ML": ["Machine Learning", "Data Science", "Python", "SQL", "R", "Scala"],
  DevOps: ["DevOps", "AWS", "Google Cloud", "Azure", "Linux", "Git"],
  Design: ["UX Design", "Figma"],
  Mobile: ["Swift", "Kotlin"],
  Product: ["Product Management"],
  Algorithms: ["DSA", "C++", "Java", "Go", "Rust", "R", "Scala"],
};

const GO_FALSE_POSITIVE_BEFORE =
  /\b(let'?s|lets|need to|want to|going to|go to|will|can|should|must|to|and|or|we|you|they|i)\s+go\b/i;

function protectTechNames(text: string): string {
  return text
    .replace(/next\.js/gi, "nextjs")
    .replace(/node\.js/gi, "nodejs")
    .replace(/react\.js/gi, "reactjs")
    .replace(/vue\.js/gi, "vuejs")
    .replace(/\.net/gi, "dotnet")
    .replace(/c\+\+/gi, "cpp")
    .replace(/c#/gi, "csharp")
    .replace(/scikit-learn/gi, "sklearnprotected");
}

function markPhraseRanges(text: string): { mask: boolean[]; phraseHits: { phrase: string; start: number; end: number }[] } {
  const mask = new Array(text.length).fill(false);
  const phraseHits: { phrase: string; start: number; end: number }[] = [];
  const lower = text.toLowerCase();

  for (const phrase of MULTI_WORD_PHRASES) {
    let idx = 0;
    while (idx < lower.length) {
      const found = lower.indexOf(phrase, idx);
      if (found === -1) break;
      const end = found + phrase.length;
      const overlaps = mask.slice(found, end).some(Boolean);
      if (!overlaps) {
        for (let i = found; i < end; i++) mask[i] = true;
        phraseHits.push({ phrase, start: found, end });
      }
      idx = found + 1;
    }
  }

  return { mask, phraseHits };
}

function tokenizeRemaining(text: string, mask: boolean[]): string[] {
  let segment = "";
  const tokens: string[] = [];

  const flush = () => {
    const t = segment.trim().toLowerCase();
    if (t) tokens.push(t);
    segment = "";
  };

  for (let i = 0; i < text.length; i++) {
    if (mask[i]) {
      flush();
      continue;
    }
    const ch = text[i];
    if (/[\s,\n\r\t\-\/\:\(\)\[\]\{\}\.\!\?\"']/.test(ch)) {
      flush();
    } else {
      segment += ch;
    }
  }
  flush();
  return tokens;
}

function lookupToken(
  token: string,
  rawText: string,
  tokenOffset: number
): { canonical: string | null; skipReason?: string } {
  if (token.length < 2) return { canonical: null, skipReason: "too short" };
  if (/^\d+$/.test(token)) return { canonical: null, skipReason: "numeric" };
  if (STOPWORDS.has(token)) return { canonical: null, skipReason: "stopword" };

  if (token === "testing") {
    return { canonical: null, skipReason: "ambiguous testing token" };
  }

  if (token === "go") {
    const before = rawText.slice(Math.max(0, tokenOffset - 30), tokenOffset + 2).toLowerCase();
    if (GO_FALSE_POSITIVE_BEFORE.test(before + "go") || /\bto\s+go\b/.test(before + "go")) {
      return { canonical: null, skipReason: "english go" };
    }
  }

  if (token === "ai") {
    if (SKILL_MAP[token]) return { canonical: SKILL_MAP[token] };
  }

  if (token === "r") {
    if (SKILL_MAP[token]) return { canonical: SKILL_MAP[token] };
    return { canonical: null, skipReason: "no match" };
  }

  if (SKILL_MAP[token]) {
    return { canonical: SKILL_MAP[token] };
  }

  if (token.length < 5) {
    return { canonical: null, skipReason: "no exact match" };
  }

  let bestKey: string | null = null;
  for (const key of Object.keys(SKILL_MAP)) {
    if (key.length < 5 || STOPWORDS.has(key)) continue;
    const fuzzy =
      token === key ||
      (token.includes(key) && key.length >= 5) ||
      (key.includes(token) && token.length >= 5);
    if (fuzzy) {
      if (!bestKey || key.length > bestKey.length) bestKey = key;
    }
  }

  if (bestKey) return { canonical: SKILL_MAP[bestKey] };
  return { canonical: null, skipReason: "no match" };
}

function mergeSkill(
  map: Map<string, DetectedSkill>,
  canonical: string,
  matchedToken: string
) {
  const existing = map.get(canonical);
  if (existing) {
    if (!existing.matchedTokens.includes(matchedToken)) {
      existing.matchedTokens.push(matchedToken);
    }
  } else {
    map.set(canonical, { canonical, level: "unspecified", matchedTokens: [matchedToken] });
  }
}

function aliasesForCanonical(canonical: string): string[] {
  return Object.entries(SKILL_MAP)
    .filter(([, c]) => c === canonical)
    .map(([k]) => k);
}

function findSkillPositions(text: string, canonical: string): number[] {
  const lower = text.toLowerCase();
  const positions: number[] = [];
  const terms = [canonical.toLowerCase(), ...aliasesForCanonical(canonical)];
  for (const term of terms) {
    let idx = 0;
    while (idx < lower.length) {
      const found = lower.indexOf(term, idx);
      if (found === -1) break;
      positions.push(found);
      idx = found + term.length;
    }
  }
  return positions;
}

function closestSignalLevel(
  text: string,
  skillPos: number,
  signals: { phrase: string; level: ProficiencyLevel }[],
  window = 80
): { level: ProficiencyLevel; distance: number } | null {
  const lower = text.toLowerCase();
  let best: { level: ProficiencyLevel; distance: number } | null = null;

  for (const { phrase, level } of signals) {
    let idx = 0;
    while (idx < lower.length) {
      const found = lower.indexOf(phrase, idx);
      if (found === -1) break;
      const signalCenter = found + phrase.length / 2;
      const distance = Math.abs(signalCenter - skillPos);
      if (distance <= window) {
        if (!best || distance < best.distance) {
          best = { level, distance };
        }
      }
      idx = found + phrase.length;
    }
  }
  return best;
}

export function detectProficiency(
  text: string,
  skillCanonical: string,
  mode: "resume" | "jd" | "list" = "list"
): ProficiencyLevel {
  const positions = findSkillPositions(text, skillCanonical);
  if (positions.length === 0) return "unspecified";

  const beginner = BEGINNER_SIGNALS.map((phrase) => ({
    phrase,
    level: "beginner" as ProficiencyLevel,
  }));
  const moderate = MODERATE_SIGNALS.map((phrase) => ({
    phrase,
    level: "moderate" as ProficiencyLevel,
  }));
  const expert = EXPERT_SIGNALS.map((phrase) => ({
    phrase,
    level: "expert" as ProficiencyLevel,
  }));

  let best: { level: ProficiencyLevel; distance: number } | null = null;

  for (const pos of positions) {
    for (const group of [expert, moderate, beginner]) {
      const hit = closestSignalLevel(text, pos, group);
      if (hit && (!best || hit.distance < best.distance)) {
        best = hit;
      }
    }
  }

  if (best) return best.level;

  if (mode === "jd") {
    for (const pos of positions) {
      const jdHit = closestSignalLevel(text, pos, [
        ...JD_MODERATE_SIGNALS.map((phrase) => ({ phrase, level: "moderate" as ProficiencyLevel })),
        ...["expert", "advanced", "senior"].map((phrase) => ({
          phrase,
          level: "expert" as ProficiencyLevel,
        })),
      ]);
      if (jdHit) return jdHit.level;
    }
  }

  const lower = text.toLowerCase();
  const canonLower = skillCanonical.toLowerCase();
  const escapedCanonLower = canonLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (/\(beginner\)/.test(lower) && lower.includes(canonLower)) return "beginner";
  if (/\(junior\)/.test(lower) && lower.includes(canonLower)) return "beginner";
  if (new RegExp(`${escapedCanonLower}\\s*-\\s*\\d+\\s*years?`).test(lower)) return "moderate";
  if (new RegExp(`\\d+\\+?\\s*years?\\s+${escapedCanonLower}`).test(lower)) return "expert";
  if (new RegExp(`${escapedCanonLower}\\s+expert`).test(lower)) return "expert";
  if (new RegExp(`expert\\s+${escapedCanonLower}`).test(lower)) return "expert";

  return "unspecified";
}

export function guessDiscipline(skills: DetectedSkill[]): string | null {
  const scores: Record<string, number> = {};
  for (const [discipline, members] of Object.entries(DISCIPLINE_BUCKETS)) {
    scores[discipline] = skills.filter((s) => members.includes(s.canonical)).length;
  }

  const max = Math.max(...Object.values(scores), 0);
  if (max === 0) return null;

  const top = Object.entries(scores).filter(([, v]) => v === max).map(([k]) => k);
  if (top.length === 1) return top[0];

  if (top.includes("Frontend") && top.includes("Backend")) return "Full-stack";
  if (top.includes("Data & ML")) return "Data & ML";

  return top[0];
}

export function parseSkills(
  text: string,
  mode: "resume" | "jd" | "list" = "list"
): ParseResult {
  const rawText = text;
  const lower = text.toLowerCase();
  const skillMap = new Map<string, DetectedSkill>();
  const tokenTrace: TokenTrace[] = [];

  const { mask, phraseHits } = markPhraseRanges(lower);

  for (const { phrase } of phraseHits) {
    const canonical = SKILL_MAP[phrase];
    if (canonical) {
      mergeSkill(skillMap, canonical, phrase);
      tokenTrace.push({ token: phrase, hit: true, canonical });
    }
  }

  const protectedText = protectTechNames(lower);
  const tokens = tokenizeRemaining(protectedText, mask);

  let searchOffset = 0;
  for (const token of tokens) {
    const tokenOffset = protectedText.indexOf(token, searchOffset);
    if (tokenOffset >= 0) searchOffset = tokenOffset + token.length;

    const { canonical, skipReason } = lookupToken(token, rawText, tokenOffset);
    if (canonical) {
      mergeSkill(skillMap, canonical, token);
      tokenTrace.push({ token, hit: true, canonical });
    } else {
      tokenTrace.push({ token, hit: false, skipReason });
    }
  }

  const skills = Array.from(skillMap.values()).map((skill) => ({
    ...skill,
    level: detectProficiency(rawText, skill.canonical, mode),
  }));

  skills.sort((a, b) => a.canonical.localeCompare(b.canonical));

  return {
    skills,
    discipline: guessDiscipline(skills),
    tokenTrace,
  };
}

export function extractSkillsFromText(text: string): string[] {
  return parseSkills(text, "list").skills.map((s) => s.canonical);
}
