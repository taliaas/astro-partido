import { defineAction, ActionError } from "astro:actions";
import { z } from "zod";
import { getSession } from "auth-astro/server.ts";
import { API_URL } from "astro:env/client";

const status = ["APROBADA", "RECHAZADA"];
const severity = ["LEVE", "GRAVE", "MEDIA"];

export const createSancion = defineAction({
  input: z.object({
    causa: z.string().min(1),
    fecha: z.coerce.date(),
    details: z.string(),
    severidad: z.enum(severity).optional(),
    duracion: z.coerce.number().min(1),
    estado: z.enum(status).optional(),
    militante: z.object({ id: z.number().int().positive() }),
  }),
  async handler(
    { causa, fecha, severidad, duracion, estado, militante,details },
    context
  ) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const body = JSON.stringify({
      details,
      causa,
      fecha: fecha.toISOString(),
      severidad: severidad || "LEVE",
      duracion: Number(duracion) || 1,
      estado: estado || "APROBADA",
      militante,
    });
      console.log(body)
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
  input: z.object({
    id: z.number().int().positive(),
    causa: z.string().min(1).optional(),
    fecha: z.coerce.date().optional(),
    details: z.string().optional(),
    severidad: z.enum(severity).optional(),
    duracion: z.coerce.number().min(1).max(365).optional(),
    estado: z.enum(status).optional(),
    militante: z.object({ id: z.number().int().positive() }).optional(),
  }),
  async handler(
    { id, causa, fecha, severidad, duracion, estado, militante,details, },
    context
  ) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const updateData: any = {};
    if (details !== undefined) updateData.details = details;
    if (causa !== undefined) updateData.causa = causa;
    if (fecha !== undefined) updateData.fecha = fecha.toISOString();
    if (severidad !== undefined) updateData.severidad = severidad;
    if (duracion !== undefined) updateData.duracion = duracion;
    if (estado !== undefined) updateData.estado = estado;
    if (militante !== undefined) updateData.militante = militante;

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
