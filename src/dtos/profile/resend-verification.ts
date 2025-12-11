import * as z from "zod";

export const ResendVerificationDTO = z.object({
  email: z.email(),
});

export type ResendVerificationDTOType = z.infer<typeof ResendVerificationDTO>;
