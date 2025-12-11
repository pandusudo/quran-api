import * as z from "zod";

export const NoteCreateDTO = z.object({
  pageId: z.number().min(1),
  ayahId: z.number().min(1),
  content: z.string().min(1).max(500),
  surahName: z.string().min(1).max(100),
  ayahNumber: z.number().min(1),
  color: z.string().min(3).max(20).optional(),
});

export type NoteCreateDTOType = z.infer<typeof NoteCreateDTO>;
