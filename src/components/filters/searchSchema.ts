import { MinuteStatus } from "@/enum/Estado";
import { z } from "zod";

export type SearchData = z.infer<typeof searchSchema>;
export const searchSchema = z.object({
  name: z.string(),
  core: z.string(),
  doc_type: z.string(),
  keywords: z.string(),
  status: z.nativeEnum(MinuteStatus).nullable(),
});
