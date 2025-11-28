import { z } from "zod";
import { absenceReasons, cargos } from "@/enum/absenceReasons.ts";

const today = new Date();
today.setHours(0, 0, 0, 0);

export type FormSchema = z.infer<typeof form_schema>;
export const form_schema = z.object({
  core: z.any(),
  fecha: z.string().date("La fecha no es válida"), //.refine((value)=> new Date(value)).max(today, { message: "La fecha no puede ser mayor a la actual" }),
  hora: z.string().time("Hora invalida").min(1, { message: "Hora invalida" }),
  lugar: z.string().min(3, "El lugar debe contener al menos 3 caracteres"),
  status: z.string().optional(),
  invitados: z
    .object({
      id: z.coerce.number().optional(),
      nombre_apellidos: z.string(),
      cargo: z.enum(cargos, { message: "Cargo incorrecto" }),
    })
    .array(),
  abscents: z
    .object({
      id: z.coerce.number().optional(),
      estado: z.enum(["Presente", "Virtual", "Ausente"]),
      reason: z.enum(absenceReasons).nullable(),
      militanteId: z.coerce.number().optional(),
      minuteId: z.coerce.number().optional(),
    })
    .array(),
  order: z
    .string()

    .array(),
  development: z
    .object({
      content: z.string(),
      agreements: z
        .object({
          id: z.coerce.number().optional(),
          descripcion: z.string(),
          responsable: z.object({ id: z.coerce.number() }),
          fecha: z.string().date(), //z.coerce.date().max(today, { message: "La fecha no puede ser mayor a la actual" }),
        })
        .array()
        .default([]),
    })
    .array(),
  fechaProx: z.string().date("La fecha no es válida"), //.min(today, { message: "La fecha no puede ser menor a la actual" }),
  fechaPrep: z.string().date("La fecha no es válida"), //.min(today, { message: "La fecha no puede ser menor a la actual" }),
  fechaCP: z.string().date("La fecha no es válida"), //.min(today, { message: "La fecha no puede ser menor a la actual" }),
});
