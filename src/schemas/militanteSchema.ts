import { Clasificacion, Nivel, Raza, Sexo } from "@/enum/Status";
import { ciSchema } from "@/schemas/ci";
import { z } from "zod";

export const militanteSchema = z.object({
  id: z.string(),
  firstname: z.string().min(1, { message: "Campo obligatorio" }),
  lastname: z.string().min(1, { message: "Campo obligatorio" }),
  core: z.coerce.string().min(1, { message: "Campo obligatorio" }),
  ci: ciSchema,
  email: z.string().min(1, { message: "Campo obligatorio" }),
  organization: z.enum(["PCC", "UJC"]),
  sexo: z.nativeEnum(Sexo).optional(),
  raza: z.nativeEnum(Raza).optional(),
  religion: z.string(),
  nivel_escolar: z.nativeEnum(Nivel).optional(),
  clasificacion: z.nativeEnum(Clasificacion).optional(),
  work: z.string(),
  cuenta_propia: z.boolean(),
  fundador: z.boolean(),
  CIPCC: z.string(),
  militant_doble: z.boolean(),
  expediente: z.string(),
  address: z.string(),
  phone: z
    .string()
    .max(8, { message: "El número de teléfono debe contener 8 carácteres" }),
});
export type MilitanteSchema = z.infer<typeof militanteSchema>;
