import { z } from "zod";
import { absenceReasons, cargos } from "@/enum/absenceReasons.ts";
import type Minute from "@/interface/Minute";
import { MinuteStatus, MinuteType } from "@/enum/Estado";
import { Reason } from "@/interface/Absent";

const today = new Date();
today.setHours(0, 0, 0, 0);

export type FormSchema = z.infer<typeof form_schema>;
export const form_schema = z.object({
  core: z.any(),
  date: z.string().date("La fecha no es válida"), //.refine((value)=> new Date(value)).max(today, { message: "La fecha no puede ser mayor a la actual" }),
  hour: z.string().time("Hora invalida").min(1, { message: "Hora invalida" }),
  place: z.string().min(3, "El lugar debe contener al menos 3 caracteres"),
  status: z.string().optional(),
  type: z.string().default("Ordinaria"),
  militants: z
    .object({
      id: z.coerce.string(),
      firstname: z.string(),
      lastname: z.string(),
      ci: z.string(),
      email: z.string(),
      organization: z.string(),
      address: z.string(),
      phone: z.string(),
    })
    .array(),
  invitados: z
    .object({
      id: z.coerce.number().optional(),
      nombre_apellidos: z.string(),
      cargo: z.enum(cargos, { message: "Cargo incorrecto" }),
    })
    .array(),
  abscents: z
    .object({
      estado: z.enum(["Presente", "Virtual", "Ausente"]),
      reason: z.enum(absenceReasons).nullable(),
      militanteId: z.string().optional(),
    })
    .array(),
  order: z.string().array(),
  development: z
    .object({
      content: z.string({ message: "Error" }),
      workplan: z
        .object({
          id: z.string().optional(),
          descripcion: z.string(),
          responsable: z.object({ id: z.string() }),

          participants: z.object({ id: z.string() }),
          enddate: z.string().date(), //z.coerce.date().max(today, { message: "La fecha no puede ser mayor a la actual" }),
        })
        .array()
        .default([]),
      agreements: z
        .object({
          id: z.string().optional(),
          descripcion: z.string(),
          responsable: z.object({ id: z.string() }),

          participants: z.object({ id: z.string() }),
          enddate: z.string().date(), //z.coerce.date().max(today, { message: "La fecha no puede ser mayor a la actual" }),
        })
        .array()
        .default([]),
    })
    .array()
    .default([]),

  fechaProx: z.string().date("La fecha no es válida"), //.min(today, { message: "La fecha no puede ser menor a la actual" }),
  fechaPrep: z.string().date("La fecha no es válida"), //.min(today, { message: "La fecha no puede ser menor a la actual" }),
  fechaCP: z.string().date("La fecha no es válida"), //.min(today, { message: "La fecha no puede ser menor a la actual" }),
});

export const editFormSchema = z.object({
  core: z.any(),
  date: z.string().date("La fecha no es válida"), //.refine((value)=> new Date(value)).max(today, { message: "La fecha no puede ser mayor a la actual" }),
  hour: z.string().time("Hora invalida").min(1, { message: "Hora invalida" }),
  place: z.string().min(3, "El lugar debe contener al menos 3 caracteres"),
  status: z.nativeEnum(MinuteStatus).optional(),
  type: z.nativeEnum(MinuteType),
  militants: z
    .object({
      id: z.coerce.string(),
      firstname: z.string(),
      lastname: z.string(),
      ci: z.string(),
      email: z.string(),
      organization: z.string(),
      address: z.string(),
      phone: z.string(),
    })
    .array(),
  invitados: z
    .object({
      id: z.coerce.number().optional(),
      nombre: z.string(),
      cargo: z.enum(cargos, { message: "Cargo incorrecto" }),
    })
    .array(),
  abscents: z
    .object({
      estado: z.enum(["Presente", "Virtual", "Ausente"]),
      reason: z.nativeEnum(Reason).nullish(),
      militanteId: z.string().optional(),
    })
    .array(),
  order: z.string().array(),
  development: z
    .object({
      content: z.string({ message: "Error" }),
      workplan: z
        .object({
          id: z.string().optional(),
          descripcion: z.string(),
          responsable: z.object({ id: z.string() }),
          participants: z.object({ id: z.string() }).array(),
          enddate: z.coerce.date(), //z.coerce.date().max(today, { message: "La fecha no puede ser mayor a la actual" }),
        })
        .array()
        .default([]),
      agreements: z
        .object({
          id: z.string().optional(),
          descripcion: z.string(),
          responsable: z.object({ id: z.string() }),
          participants: z.object({ id: z.string() }).array(),
          enddate: z.coerce.date(), //z.coerce.date().max(today, { message: "La fecha no puede ser mayor a la actual" }),
        })
        .array()
        .default([]),
    })
    .array()
    .default([]),

  fechaProx: z.string().date("La fecha no es válida"), //.min(today, { message: "La fecha no puede ser menor a la actual" }),
  fechaPrep: z.string().date("La fecha no es válida"), //.min(today, { message: "La fecha no puede ser menor a la actual" }),
  fechaCP: z.string().date("La fecha no es válida"), //.min(today, { message: "La fecha no puede ser menor a la actual" }),
});
