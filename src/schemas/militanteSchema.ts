import { Clasificacion, Nivel, Raza, Sexo } from "@/enum/Status";
import { ciSchema } from "@/schemas/ci";
import { z } from "zod";

export const militanteSchema = z.object({
  id: z.string(),
  firstname: z.string().min(1, { message: "Campo obligatorio" }),
  lastname: z.string().min(1, { message: "Campo obligatorio" }),
  core: z.coerce.number().min(1, { message: "Campo obligatorio" }),
  ci: ciSchema,
  date: z.string().date("Error"),
  email: z.string().min(1, { message: "Campo obligatorio" }),
  organization: z.enum(["PCC", "UJC"]),
  sexo: z.nativeEnum(Sexo, { message: "El sexo es requerido" }).optional(),
  raza: z.nativeEnum(Raza, { message: "La raza es requerida" }).optional(),
  religion: z.string(),
  nivel_escolar: z
    .nativeEnum(Nivel, { message: "El nivel escolar es requerido" })
    .optional(),
  clasificacion: z
    .nativeEnum(Clasificacion, { message: "La clasificación es requerida" })
    .optional(),
  work: z.string({ message: "El puesto de trabajo es requerido" }),
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
