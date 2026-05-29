export const ROLES_DATABASE = [
  {
    id: "frontend",
    title: "Frontend Engineer",
    description:
      "Build responsive UIs with modern frameworks, type safety, and solid CSS workflow.",
    typicalSalary: "$95k – $145k",
    difficulty: "Moderate",
    skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Git"],
    courses: [
      {
        title: "Meta Front-End Developer Professional Certificate",
        skills: ["React", "JavaScript", "Tailwind CSS", "Git"],
        duration: "4 months",
        provider: "Meta",
      },
    ],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    description: "Query data, build dashboards, and communicate insights to stakeholders.",
    typicalSalary: "$78k – $115k",
    difficulty: "Moderate",
    skills: ["SQL", "Python", "Data Science", "Git"],
    courses: [
      {
        title: "Google Data Analytics Professional Certificate",
        skills: ["SQL", "Python", "Data Science"],
        duration: "6 months",
        provider: "Google",
      },
    ],
  },
  {
    id: "ml-engineer",
    title: "ML Engineer",
    description: "Train models and deploy inference pipelines at scale.",
    typicalSalary: "$120k – $175k",
    difficulty: "High",
    skills: ["Python", "Machine Learning", "Git"],
    courses: [
      {
        title: "Deep Learning Specialization — DeepLearning.AI",
        skills: ["Python", "Machine Learning"],
        duration: "5 months",
        provider: "DeepLearning.AI",
      },
    ],
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    description: "Research users, prototype flows, and ship accessible interfaces.",
    typicalSalary: "$82k – $125k",
    difficulty: "Moderate",
    skills: ["UX Design", "Figma"],
    courses: [
      {
        title: "Google UX Design Professional Certificate",
        skills: ["UX Design", "Figma"],
        duration: "6 months",
        provider: "Google",
      },
    ],
  },
  {
    id: "product-manager",
    title: "Product Manager",
    description: "Own roadmap, metrics, and cross-functional delivery.",
    typicalSalary: "$105k – $160k",
    difficulty: "Moderate",
    skills: ["Product Management"],
    courses: [
      {
        title: "Brand Management Specialization — University of London",
        skills: ["Product Management"],
        duration: "3 months",
        provider: "University of London",
      },
    ],
  },
] as const;

export type Role = (typeof ROLES_DATABASE)[number];
