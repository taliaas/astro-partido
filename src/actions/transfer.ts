import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/client";
import { getSession } from "auth-astro/server";
import { z } from "zod";

const Estado = ['Pendiente',
    'Completado'] as const

export const createTransfer = defineAction({
    input: z.object({
        origen: z.string().min(3),
        destino: z.string().min(3),
        details: z.string().optional(),
        fecha: z.coerce.date(),
        estado: z.enum(Estado),
        militante: z.object({ id: z.coerce.number() })
    }),
    async handler({ origen, destino, fecha, estado, militante, details }, context) {
        const session: any = await getSession(context.request);
        if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

        try {
            const body = JSON.stringify({
                origen,
                destino,
                fecha,
                estado,
                details,
                militante
            });

            const res = await fetch(`${API_URL}/trasfer`, {
                method: "POST",
                body,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.jwt}`,
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        }
        catch (error) {
            console.log(error)
            throw new Error()
        }
    }
})

export const updateTransfer = defineAction({
    input: z.object({
        id: z.number(),
        origen: z.string().min(3).optional(),
        destino: z.string().min(3).optional(),
        details: z.string().optional(),
        fecha: z.coerce.date().optional(),
        estado: z.enum(Estado).optional(),
        militante: z.object({ id: z.coerce.number() }).optional()
    }),
    async handler({ id, origen, destino, fecha, estado, militante, details }, context) {
        const session: any = await getSession(context.request);
        if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

        try {
            const body = {
                origen,
                destino,
                fecha: fecha?.toISOString(), // Convertir Date a string
                estado,
                details,
                militante
            };
            
            const res = await fetch(`${API_URL}/trasfer/${id}`, {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.jwt}`,
                },

            });

            if(res.status === 400)
                throw new Error()
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return await res.json();
        }
        catch (error) {
            console.log(error)
            throw new Error()
        }
    }
})