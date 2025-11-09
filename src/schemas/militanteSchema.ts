import { ciSchema } from "@/schemas/ci";
import { z } from "zod";

export const militanteSchema = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  core: z.string(),
  ci: ciSchema,
  email: z.string(),
  organization: z.enum(["PCC", "UJC"]),
  address: z.string(),
  phone: z
    .string()
    .max(8, { message: "El número de teléfono debe contener 8 carácteres" }),
});
export type MilitanteSchema = z.infer<typeof militanteSchema>;
