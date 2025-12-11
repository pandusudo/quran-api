import * as z from "zod";
import {
  ReadingPlanFilter,
  ReadingPlanFrequency,
} from "../../generated/prisma/enums";

export const ReadingPlanUpdateDTO = z.object({
  amount: z.number().min(1).optional(),
  filter: z.enum(ReadingPlanFilter).optional(),
  frequency: z.enum(ReadingPlanFrequency).optional(),
  title: z.string().min(1).max(100).optional(),
  icon: z.string().min(1).max(100).optional(),
  customDay: z.number().min(0).max(6).optional(),
  chapterId: z.number().min(1).optional(),
  chapterName: z.string().min(1).max(100).optional(),
  chapterPages: z.string().optional(),
});

export type ReadingPlanUpdateDTOType = z.infer<typeof ReadingPlanUpdateDTO>;
