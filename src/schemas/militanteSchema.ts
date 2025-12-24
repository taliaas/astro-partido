import { Clasificacion, Raza, Sexo } from "@/enum/Status";
import { ciSchema } from "@/schemas/ci";
import { z } from "zod";

export const militanteSchema = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  core: z.coerce.string(),
  ci: ciSchema,
  email: z.string(),
  organization: z.enum(["PCC", "UJC"]),
  abscents: z.object({}),
  user: z.object({}),
  sexo: z.nativeEnum(Sexo),
  raza: z.nativeEnum(Raza),
  religion: z.string(),
  nivel_escolar: z.string(),
  clasificacion: z.nativeEnum(Clasificacion),
  work: z.string(),
  cuenta_propia: z.boolean(),
  fundador: z.boolean(),
  date: z.boolean(),
  CIPCC: z.string(),
  militant_doble: z.boolean(),
  expediente: z.string(),
  address: z.string(),
  phone: z
    .string()
    .max(8, { message: "El número de teléfono debe contener 8 carácteres" }),
});
export type MilitanteSchema = z.infer<typeof militanteSchema>;
