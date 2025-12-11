import * as z from "zod";
import {
  ReadingPlanFilter,
  ReadingPlanFrequency,
} from "../../generated/prisma/enums";

export const ReadingPlanCreateDTO = z.object({
  amount: z.number().min(1).optional(),
  filter: z.enum(ReadingPlanFilter),
  frequency: z.enum(ReadingPlanFrequency),
  title: z.string().min(1).max(100),
  icon: z.string().min(1).max(100),
  customDay: z.number().min(0).max(6).optional(),
  chapterId: z.number().min(1).optional(),
  chapterName: z.string().min(1).max(100).optional(),
  chapterPages: z.string().optional(),
});

export type ReadingPlanCreateDTOType = z.infer<typeof ReadingPlanCreateDTO>;
