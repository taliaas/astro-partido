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
    estado: z.enum(EstadoDesactivacion).optional().default('PENDIENTE'),
    militanteId: z.number(),
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
        estado: estado || 'PENDIENTE',
        militanteId,
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
    estado: z.string().optional(),
    nucleoId: z.string().optional(),
  }),
  handler: async ({ estado, nucleoId }, context) => {
    const session: any = await getSession(context.request);
    if (!session) {
      throw new ActionError({ 
        code: "UNAUTHORIZED",
        message: "Debe iniciar sesión para realizar esta acción"
      });
    }

    // Construir URL con parámetros de filtro
    const params = new URLSearchParams();
    if (estado) params.append('estado', estado);
    if (nucleoId) params.append('nucleoId', nucleoId);

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
    
    const filename = estado 
      ? `desactivaciones_${estado.toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`
      : `desactivaciones_todas_${new Date().toISOString().split('T')[0]}.pdf`;
    
    return { 
      pdf: base64,
      filename
    };
  }
});