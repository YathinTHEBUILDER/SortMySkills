import { z } from "zod";

export const roadmapResourceSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
  platform: z.string().min(1),
  is_free: z.boolean(),
});

export const roadmapTaskSchema = z.object({
  task: z.string().min(1),
  type: z.enum(["learn", "build", "apply", "fix"]),
  time_estimate: z.string().min(1),
  resource: roadmapResourceSchema.optional(),
});

export const roadmapGapSchema = z.object({
  gap: z.string().min(1),
  severity: z.enum(["critical", "moderate", "minor"]),
  explanation: z.string().min(1),
});

export const roadmapPhaseSchema = z.object({
  week_range: z.string().min(1),
  theme: z.string().min(1),
  goal: z.string().min(1),
  tasks: z.array(roadmapTaskSchema).min(1),
  milestone: z.string().min(1),
});

export const roadmapResultSchema = z.object({
  why_no_reply: z.object({
    summary: z.string().min(1),
    top_gaps: z.array(roadmapGapSchema).min(1),
  }),
  roadmap: z.array(roadmapPhaseSchema).min(1),
  success_metrics: z.array(z.string().min(1)).min(1),
  honest_warning: z.string().min(1),
});

export type RoadmapResult = z.infer<typeof roadmapResultSchema>;
