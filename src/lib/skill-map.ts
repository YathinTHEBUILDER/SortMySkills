/** Local skill normalization registry — shared across homepage and job-match */
export const SKILL_MAP: Record<string, string> = {
  react: "React",
  "react.js": "React",
  reactjs: "React",
  "react native": "React",
  js: "JavaScript",
  javascript: "JavaScript",
  es6: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  py: "Python",
  python: "Python",
  python3: "Python",
  ml: "Machine Learning",
  machinelearning: "Machine Learning",
  "deep learning": "Machine Learning",
  deeplearning: "Machine Learning",
  ds: "Data Science",
  datascience: "Data Science",
  pandas: "Data Science",
  numpy: "Data Science",
  ux: "UX Design",
  figma: "UX Design",
  uiux: "UX Design",
  "ui/ux": "UX Design",
  "product design": "UX Design",
  pm: "Product Management",
  "product management": "Product Management",
  agile: "Product Management",
  scrum: "Product Management",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  css: "Tailwind CSS",
  node: "Node.js",
  nodejs: "Node.js",
  "node.js": "Node.js",
  sql: "SQL",
  postgresql: "SQL",
  mysql: "SQL",
  sqlquery: "SQL",
  git: "Git",
  github: "Git",
  aws: "AWS",
  "amazon web services": "AWS",
  s3: "AWS",
  ec2: "AWS",
  gcp: "Google Cloud",
  "google cloud": "Google Cloud",
  firebase: "Google Cloud",
  docker: "DevOps",
  kubernetes: "DevOps",
  k8s: "DevOps",
  graphql: "GraphQL",
  apollo: "GraphQL",
  gql: "GraphQL",
  mongodb: "MongoDB",
  mongo: "MongoDB",
  nosql: "MongoDB",
};

export function extractSkillsFromText(text: string): string[] {
  const tokens = text
    .toLowerCase()
    .split(/[,\s\n\-\:\(\)]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const matched: string[] = [];

  tokens.forEach((token) => {
    if (SKILL_MAP[token] && !matched.includes(SKILL_MAP[token])) {
      matched.push(SKILL_MAP[token]);
      return;
    }
    Object.keys(SKILL_MAP).forEach((key) => {
      if (
        (token === key || token.includes(key) || key.includes(token)) &&
        token.length > 1 &&
        !matched.includes(SKILL_MAP[key])
      ) {
        matched.push(SKILL_MAP[key]);
      }
    });
  });

  return matched;
}
