import { ActionError, defineAction } from "astro:actions";
import { z } from "zod";
import { getSession } from "auth-astro/server.ts";
import { API_URL } from "astro:env/client";

const statusDesactivacion = ["PENDIENTE", "APROBADA", "RECHAZADA"] as const;

export const deactiveMili = defineAction({
  input: z.object({
    reason: z.string().min(3, "El motivo debe tener al menos 3 caracteres"),
    details: z.string().optional(),
    date: z.string().min(1, "La fecha es requerida"),
    status: z.enum(statusDesactivacion).optional().default('PENDIENTE'),
    militantId: z.number(),
  }),
  handler: async ({ reason, status, date, details, militantId }, context) => {
    const session: any = await getSession(context.request);
    const res = await fetch(`${API_URL}/desactivation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session?.jwt,
      },
      body: JSON.stringify({
        reason,
        date,
        status: status || 'PENDIENTE',
        militantId,
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
    reason: z.string().min(3, "El motivo debe tener al menos 3 caracteres").optional(),
    details: z.string().optional(),
    date: z.string().optional(),
    status: z.enum(statusDesactivacion).optional(),
  }),
  async handler({ id, reason, details, date, status }, context) {
    const session: any = await getSession(context.request);
    const res = await fetch(`${API_URL}/desactivation/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session?.jwt,
      },
      body: JSON.stringify({
        reason,
        date,
        status,
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

export const exportDesactivation = defineAction({
  input: z.object({ id: z.number().int().positive() }),
  handler: async ({ id }, context) => {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/desactivation/${id}/export`, {
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error al generar el PDF: ${errorText}`
      });
    }
    
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    
    return { 
      pdf: base64,
      filename: `desactivacion_${id}.pdf`
    };
  }
});

// Exportar listado de desactivaciones con filtros
export const exportListadoDesactivaciones = defineAction({
  input: z.object({
    status: z.string().optional(),
    nucleoId: z.string().optional(),
    date: z.string().optional(),
  }),
  handler: async ({ status, nucleoId, date }, context) => {
    const session: any = await getSession(context.request);
    if (!session) {
      throw new ActionError({ 
        code: "UNAUTHORIZED",
        message: "Debe iniciar sesión para realizar esta acción"
      });
    }

    // Construir URL con parámetros de filtro
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (nucleoId) params.append('nucleoId', nucleoId);
    if (date) params.append('date', date);

    const url = `${API_URL}/desactivation/export/listado${params.toString() ? `?${params.toString()}` : ''}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error al generar el PDF: ${errorText}`
      });
    }
    
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    
    const filename = status 
      ? `desactivaciones_${status.toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`
      : `desactivaciones_todas_${new Date().toISOString().split('T')[0]}.pdf`;
    
    return { 
      pdf: base64,
      filename
    };
  }
});