import * as z from "zod";

export const HistoryCreateDTO = z.object({
  pageId: z.number().min(1),
  surahId: z.number().min(1),
  ayahNumber: z.number().min(1),
  surahName: z.string().min(1).max(100),
  juzNumber: z.number().min(1),
});

export type HistoryCreateDTOType = z.infer<typeof HistoryCreateDTO>;
