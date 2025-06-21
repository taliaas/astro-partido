import {ActionError, defineAction} from "astro:actions";
import {getSession} from "auth-astro/server.ts";
import {API_URL} from "astro:env/client";
import {z} from "astro:schema";

export const createCore = defineAction({
    input: z.object({
        name: z.string(),
        comite: z.object({id: z.number()}),
        secretarioGeneral: z.string(),
        secretarioFuncionamiento: z.string()
    }),
    async handler(input, context) {
        const session: any = await getSession(context.request);
        if (!session) throw new ActionError({code: "UNAUTHORIZED"});
        const res = await fetch(`${API_URL}/core`, {
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

export const updateCore = defineAction({
    input: z.object({
        id: z.number(),
        name: z.string().optional(),
        comite: z.object({id: z.number()}).optional(),
        secretarioGeneral: z.string().optional(),
        secretarioFuncionamiento: z.string().optional()
    }),
    async handler({id, ...input}, context) {
        const session: any = await getSession(context.request);
        if (!session) throw new ActionError({code: "UNAUTHORIZED"});
        console.log(input)
        const res = await fetch(`${API_URL}/core/${id}`, {
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

export const deleteCore = defineAction({
    input: z.number(),
    async handler(id, context) {
        const session: any = await getSession(context.request);
        if (!session) throw new ActionError({code: "UNAUTHORIZED"});
        const res = await fetch(`${API_URL}/core/${id}`, {
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