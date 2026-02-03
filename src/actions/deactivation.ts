import { ActionError, defineAction } from "astro:actions";
import { z } from "zod";
import { getSession } from "auth-astro/server.ts";
import { API_URL } from "astro:env/client";

const EstadoDesactivacion = ["PENDIENTE", "APROBADA", "RECHAZADA"] as const;

export const deactiveMili = defineAction({
  input: z.object({
    motivo: z.string().min(3),
    details: z.string().optional(),
    fecha: z.coerce.date(),
    estado: z.enum(EstadoDesactivacion).optional().default("PENDIENTE"),
    militanteId: z.number(), // Recibir militanteId en lugar de militante
  }),
  handler: async ({ motivo, estado, fecha, details, militanteId }, context) => {
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
        estado: estado || "PENDIENTE",
        militanteId, // ✅ CAMBIO: Enviar militanteId
        details,
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
    id: z.coerce.number(),
    motivo: z.string().min(3).optional(),
    details: z.string().optional(),
    fecha: z.coerce.date().optional(),
    estado: z.enum(EstadoDesactivacion).optional(),
  }),
  async handler({ id, motivo, details, fecha, estado }, context) {
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
        details,
        // ❌ NO enviar militante ni militanteId
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
