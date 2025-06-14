import {ActionError, defineAction} from "astro:actions";
import {z} from "zod";
import {getSession} from "auth-astro/server.ts";
import {API_URL} from "astro:env/client";

export const deactiveMili = defineAction({
    input: z.object({
        motivo: z.string(),
        details: z.string(),
        fecha: z.string(),
        estado: z.string(),
        militante: z.any(),
    }),
    handler: async (input, context) => {
        const session: any = await getSession(context.request);
        const res = await fetch(`${API_URL}/deactivation`, {
            method: "POsT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.jwt,
            },
            body: JSON.stringify({
                motivo: input.motivo,
                fecha: input.fecha,
                estado: input.estado,
                militante: input.militante,
            }),
        });
        if (!res.ok) {
            throw new ActionError({
                code: "INTERNAL_SERVER_ERROR",
                message: `HTTP error! status: ${res.status}`,
            });
        }
        return res.json();
    },
});
