import * as z from "zod";

export const BookmarkCreateDTO = z.object({
  title: z.string().min(1).max(100),
  surahName: z.string().min(1).max(100),
  pageId: z.number().min(1),
});

export type BookmarkCreateDTOType = z.infer<typeof BookmarkCreateDTO>;
