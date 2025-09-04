import { z } from "zod";
import { absenceReasons, cargos } from "@/enum/absenceReasons.ts";

const today = new Date();
today.setHours(0, 0, 0, 0);

export type FormSchema = z.infer<typeof form_schema>;
export const form_schema = z.object({
    core: z.any(),
    fecha: z.string().date(),//.refine((value)=> new Date(value)).max(today, { message: "La fecha no puede ser mayor a la actual" }),
    hora: z.string().time(),
    lugar: z.string().min(3),
    invitados: z.object({
        nombre_apellidos: z.string(),
        cargo: z.enum(cargos, { message: "Hola" })
    }).array(),
    abscents: z.object({
        id: z.string(),
        militante: z.object({ firstname: z.string(), lastname: z.string() }),
        estado: z.enum(['presente', 'virtual', 'ausente']),
        absenceReasons: z.enum(absenceReasons)
    }).array(),
    order: z.string().array(),
    development: z.string().array(),
    agreements: z.object({
        descripcion: z.string(),
        responsable: z.string(),
        fecha: z.string().date(),//z.coerce.date().max(today, { message: "La fecha no puede ser mayor a la actual" }),
    }).array(),
    observaciones: z.string(),
    fechaProx: z.string().date(),//.min(today, { message: "La fecha no puede ser menor a la actual" }),
    fechaPrep: z.string().date(),//.min(today, { message: "La fecha no puede ser menor a la actual" }),
    fechaCP: z.string().date(),//.min(today, { message: "La fecha no puede ser menor a la actual" }),
});
