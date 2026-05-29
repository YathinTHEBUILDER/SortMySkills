import { frontendPack } from "./frontend";
import { backendPack } from "./backend";
import { dataAnalystPack } from "./data-analyst";
import { mlEngineerPack } from "./ml-engineer";
import { uxDesignerPack } from "./ux-designer";
import { productManagerPack } from "./product-manager";
import type { InterviewPack } from "./types";

export const INTERVIEW_PACKS: InterviewPack[] = [
  frontendPack,
  backendPack,
  dataAnalystPack,
  mlEngineerPack,
  uxDesignerPack,
  productManagerPack,
];

export function getInterviewPackBySlug(slug: string): InterviewPack | undefined {
  return INTERVIEW_PACKS.find((p) => p.slug === slug || p.id === slug);
}

export type { InterviewPack, InterviewQuestion, QuestionDifficulty } from "./types";
