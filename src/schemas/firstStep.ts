import { z } from "zod"
import { Cargo } from "@/enum/Cargo"

export const reunionSchema = z.object({
    nucleo: z.string().nonempty("El núcleo es requerido"),
    fecha: z.string().nonempty("La fecha es requerida"),
    hora: z.string().nonempty("La hora es requerida"),
    lugar: z.string().nonempty("El lugar es requerido"),
    invitados: z.array(
        z.object({
            nombre_apellidos: z.string().nonempty("El nombre y apellidos son requeridos"),
            cargo: z.enum(Object.values(Cargo) as [string, ...string[]], {
                errorMap: () => ({ message: "Cargo inválido" }),
            }),
        }),
    ),
    militantes: z.array(
        z.object({
            id: z.number(),
            estado: z.enum(["presente", "virtual", "ausente"]),
            reason: z.string().optional().nullable(),
        }),
    ),
})

export type ReunionSchema = z.infer<typeof reunionSchema>

