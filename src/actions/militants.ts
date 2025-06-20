import { ActionError, defineAction } from "astro:actions";
import { z } from "zod";
import { getSession } from "auth-astro/server.ts";
import { API_URL } from "astro:env/client";

const EstadoDesactivacion = ['APROBADA', 'RECHAZADA'] as const
const ORGANIZACION = ['PCC', 'UJC'] as const

export const deactiveMili = defineAction({
    input: z.object({
        motivo: z.string().min(3),
        details: z.string().optional(),
        fecha: z.coerce.date(),
        estado: z.enum(EstadoDesactivacion),
        militante: z.any(),
    }),
    handler: async ({ motivo, estado, fecha, details, militante }, context) => {
        const session: any = await getSession(context.request);
        const res = await fetch(`${API_URL}/desactivation`, {
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
        id: z.number(),
        motivo: z.string().min(3).optional(),
        details: z.string().optional(),
        fecha: z.coerce.date().optional(),
        estado: z.enum(EstadoDesactivacion).optional(),
        militante: z.any().optional(),
    }),
    async handler({ id, motivo, details, fecha, estado, militante }, context) {
        const session: any = await getSession(context.request);
        const res = await fetch(`${API_URL}/desactivation/${id}`, {
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

export const createMember = defineAction({
    input: z.object({
        firstname: z.string().min(3),
        lastname: z.string().min(3),
        email: z.string().min(10),
        organization: z.enum(ORGANIZACION),
        estado: z.boolean(),
        address: z.string(),
        phone: z.string(),
        core: z.object({
            id: z.number(),
        })
    }),
    async handler({ firstname, lastname, email, address, core, estado, organization, phone }, context) {
        const session: any = await getSession(context.request);
        if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

        const body = JSON.stringify({
            firstname,
            lastname,
            email,
            address,
            core,
            estado,
            organization,
            phone
        });

        const res = await fetch(`${API_URL}/militantes/`, {
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

    },
})

export const updateMember = defineAction({
    input: z.object({
        id: z.number(),
        firstname: z.string(),
        lastname: z.string(),
        email: z.string(),
        organization: z.enum(ORGANIZACION),
        estado: z.boolean(),
        address: z.string(),
        phone: z.string(),
        core: z.object({
            id: z.number(),
        })
    }),
    async handler({ id, firstname, lastname, email, address, core, estado, organization, phone }, context) {
        const session: any = await getSession(context.request);
        if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

        const updateData: any = {}
        if (firstname !== undefined) updateData.firstname = firstname;
        if (lastname !== undefined) updateData.lastname = lastname;
        if (email !== undefined) updateData.email = email;
        if (address !== undefined) updateData.address = address;
        if (core !== undefined) updateData.core = core;
        if (estado !== undefined) updateData.estado = estado;
        if (organization !== undefined) updateData.organization = organization;
        if (phone !== undefined) updateData.phone = phone;

        const body = JSON.stringify(updateData);

        const res = await fetch(`${API_URL}/militantes/${id}`, {
            method: "PATCH",
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

    },
})