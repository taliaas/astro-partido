import {ActionError, defineAction} from "astro:actions";
import {z} from "astro:schema";
import {getSession} from "auth-astro/server.ts";
import {API_URL} from "astro:env/client";

export const createComite = defineAction({
    input: z.object({
        name: z.string(),
    }),
    async handler(input, context) {
        const session: any = await getSession(context.request);
        if (!session) throw new ActionError({code: "UNAUTHORIZED"});
        const res = await fetch(`${API_URL}/comite`, {
            method: "POST",
            body: JSON.stringify(input),
            headers: {
                Authorization: `Bearer ${session?.jwt}`,
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json();
    }
})

export const updateComite = defineAction({
    input: z.object({
        id: z.number(),
        name: z.string(),
    }),
    async handler({id, ...input}, context) {
        const session: any = await getSession(context.request);
        if (!session) throw new ActionError({code: "UNAUTHORIZED"});
        console.log(input)
        const res = await fetch(`${API_URL}/comite/${id}`, {
            method: "PATCH",
            body: JSON.stringify(input),
            headers: {
                Authorization: `Bearer ${session?.jwt}`,
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json();
    }
})

export const deleteComite = defineAction({
    input: z.number(),
    async handler(id, context) {
        const session: any = await getSession(context.request);
        if (!session) throw new ActionError({code: "UNAUTHORIZED"});
        const res = await fetch(`${API_URL}/comite/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session?.jwt}`,
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json();
    }
})