import {ActionError, defineAction} from "astro:actions";
import {z} from "astro:schema";
import {getSession} from "auth-astro/server.ts";
import {API_URL} from "astro:env/client";

export const deactiveMili = defineAction({
    input: z.number(),
    handler: async (input, context) => {
        const session: any = await getSession(context.request);
        const res = await fetch(`${API_URL}/militantes/deactivate/${input}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.jwt,
            },
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
