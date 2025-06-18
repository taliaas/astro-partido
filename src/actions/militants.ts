import { ActionError, defineAction } from "astro:actions";
import { z } from "zod";
import { getSession } from "auth-astro/server.ts";
import { API_URL } from "astro:env/client";

const EstadoDesactivacion = ['APROBADA', 'RECHAZADA'] as const

export const deactiveMili = defineAction({
    input: z.object({
        motivo: z.string().min(3),
        details: z.string().optional(),
        fecha: z.date(),
        estado: z.enum(EstadoDesactivacion),
        militante: z.any(),
    }),
    handler: async ({ motivo, estado, fecha, details, militante }, context) => {
        const session: any = await getSession(context.request);
        const res = await fetch(`${API_URL}/deactivation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.jwt,
            },
            body: JSON.stringify({
                motivo,
                fecha,
                estado,
                militante,
                details
            }),
        });
        if (!res.ok) {
            throw new ActionError({
                code: "INTERNAL_SERVER_ERROR",
                message: `HTTP error! status: ${res.status}`,
            });
        }
        return await res.json();
    },
});

export const updateDeactivation = defineAction({
    input: z.object({
        motivo: z.string().min(3).optional(),
        details: z.string().optional(),
        fecha: z.date().optional(),
        estado: z.enum(EstadoDesactivacion).optional(),
        militante: z.any().optional(),
    }),
    async handler({ motivo, details, fecha, estado, militante }, context) {
        const session: any = await getSession(context.request);
        const res = await fetch(`${API_URL}/deactivation`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.jwt,
            },
            body: JSON.stringify({
                motivo,
                fecha,
                estado,
                militante,
                details
            }),
        });
        if (!res.ok) {
            throw new ActionError({
                code: "INTERNAL_SERVER_ERROR",
                message: `HTTP error! status: ${res.status}`,
            });
        }
        return await res.json();
    },
})
