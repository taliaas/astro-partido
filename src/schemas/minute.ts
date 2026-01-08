import { z } from "zod";

export const minuteSchema = z.object({
  id: z.coerce.number(),
  observaciones: z.string(),
});

export type MinuteObserv = z.infer<typeof minuteSchema>;
