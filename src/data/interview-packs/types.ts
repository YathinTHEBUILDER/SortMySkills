export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface InterviewQuestion {
  id: number;
  difficulty: QuestionDifficulty;
  text: string;
}

export interface InterviewPack {
  id: string;
  title: string;
  slug: string;
  description: string;
  totalQuestions: number;
  questions: InterviewQuestion[];
}

export function buildPack(
  id: string,
  title: string,
  description: string,
  easy: string[],
  medium: string[],
  hard: string[]
): InterviewPack {
  const questions: InterviewQuestion[] = [
    ...easy.map((text, i) => ({
      id: i + 1,
      difficulty: "easy" as const,
      text,
    })),
    ...medium.map((text, i) => ({
      id: easy.length + i + 1,
      difficulty: "medium" as const,
      text,
    })),
    ...hard.map((text, i) => ({
      id: easy.length + medium.length + i + 1,
      difficulty: "hard" as const,
      text,
    })),
  ];

  return {
    id,
    title,
    slug: id,
    description,
    totalQuestions: questions.length,
    questions,
  };
}
