import * as z from "zod";

export const NoteUpdateDTO = z.object({
  content: z.string().min(1).max(500).optional(),
  color: z.string().min(3).max(20).optional(),
});

export type NoteUpdateDTOType = z.infer<typeof NoteUpdateDTO>;
