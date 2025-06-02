import { z } from "zod";
import { absenceReasons, cargos } from "@/enum/absenceReasons.ts";

const today = new Date();
today.setHours(0, 0, 0, 0);

export type FormSchema = z.infer<typeof form_schema>;
export const form_schema = z.object({
    core: z.any(),
    fecha: z.coerce.date().max(today, { message: "La fecha no puede ser mayor a la actual" }),
    hora: z.string().time(),
    lugar: z.string().min(3),
    invitados: z.object({
        nombre_apellidos: z.string(),
        cargo: z.enum(cargos)
    }).array(),
    militantes: z.object({
        id: z.string(),
        estado: z.enum(['presente', 'virtual', 'ausente']),
        absenceReasons: z.enum(absenceReasons)
    }).array(),
    order: z.string().array(),
    orientaciones: z.string(),
    chequeo: z.string(),
    analisis: z.string(),
    agreements: z.object({
        descripcion: z.string(),
        responsable: z.string(),
        fecha: z.coerce.date().max(today, { message: "La fecha no puede ser mayor a la actual" }),
    }).array(),
    observaciones: z.string(),
    fechaProx: z.coerce.date().min(today, { message: "La fecha no puede ser menor a la actual" }),
    fechaPrep: z.coerce.date().min(today, { message: "La fecha no puede ser menor a la actual" }),
    fechaCP: z.coerce.date().min(today, { message: "La fecha no puede ser menor a la actual" }),
    extranjero: z.object({
        nombre: z.string().min(3),
        motivo: z.string(),
        destino: z.string(),
        fechaIda: z.coerce.date(),
        estado: z.enum(['Pendiente', 'Aprobado', 'Rechazado']),
    }).array()
});
