import { defineAction, ActionError } from "astro:actions";
import { z } from "zod";
import { getSession } from "auth-astro/server.ts";
import { API_URL } from "astro:env/client";

export const createSancion = defineAction({
    input: z.object({
        causa: z.string().min(1),
        fecha: z.date(),
        severidad: z.enum(["LEVE", "GRAVE", "MEDIA"]).optional(),
        duracion: z.string().min(1),
        estado: z.enum(["PENDIENTE", "ACEPTADA", "RECHAZADA"]).optional(),
        militanteId: z.number().int().positive(),
    }),
    async handler({ causa, fecha, severidad, duracion, estado, militanteId }, context) {
        const session: any = await getSession(context.request);
        if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

        const body = JSON.stringify({
            causa,
            fecha: fecha.toISOString(),
            severidad: severidad || "LEVE",
            duracion: duracion || 30,
            estado: estado || "PENDIENTE",
            militanteId,
        });

        const res = await fetch(`${API_URL}/sancion`, {
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
});


export const updateSancion = defineAction({
    accept: "form",
    input: z.object({
        id: z.number().int().positive(),
        causa: z.string().min(1).optional(),
        fecha: z.date().optional(),
        severidad: z.enum(["LEVE", "GRAVE", "MEDIA"]).optional(),
        duracion: z.number().min(1).max(365).optional(),
        estado: z.enum(["PENDIENTE", "ACEPTADA", "RECHAZADA"]).optional(),
        militanteId: z.number().int().positive().optional(),
    }),
    async handler({ id, causa, fecha, severidad, duracion, estado, militanteId }, context) {
        const session: any = await getSession(context.request);
        if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

        const updateData: any = {};
        if (causa !== undefined) updateData.causa = causa;
        if (fecha !== undefined) updateData.fecha = fecha.toISOString();
        if (severidad !== undefined) updateData.severidad = severidad;
        if (duracion !== undefined) updateData.duracion = duracion;
        if (estado !== undefined) updateData.estado = estado;
        if (militanteId !== undefined) updateData.militanteId = militanteId;

        const body = JSON.stringify(updateData);

        const res = await fetch(`${API_URL}/sancion/${id}`, {
            method: "PUT",
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
});

