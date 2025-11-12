import { z } from "zod";

export const minuteSchema = z.object({
  id: z.string(),
  observations: z.string(),
});

export type MinuteObserv = z.infer<typeof minuteSchema>;
