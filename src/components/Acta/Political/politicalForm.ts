import { z } from "zod";

export const political_schema = z.object({
  core: z.any(),
  name: z.string().optional(),
  date: z.string().date("La fecha no es válida"), //.refine((value)=> new Date(value)).max(today, { message: "La fecha no puede ser mayor a la actual" }),
  hour: z.string().time("Hora invalida").min(1, { message: "Hora invalida" }),
  place: z.string().min(3, "El lugar debe contener al menos 3 caracteres"),
  status: z.string().optional(),
  type: z.string().default("Circulo Politico"),
  topic: z.string(),
  abscents: z.object({}),
  invitados: z.object({}),
  development: z
    .object({
      militant: z.object({
        id: z.string(),
      }),
      argument: z.string({ message: "Error" }),
    })
    .array()
    .default([]),
});

export const editCPFormSchema = z.object({});
