import * as z from "zod";

export const ProfileUpdateDTO = z.object({
  name: z.string().min(2).max(100),
  image: z.string().optional(),
});

export const ProfileUpdateEmailDTO = z.object({
  newEmail: z.email(),
});

export type ProfileUpdateDTOType = z.infer<typeof ProfileUpdateDTO>;
export type ProfileUpdateEmailDTOType = z.infer<typeof ProfileUpdateEmailDTO>;
