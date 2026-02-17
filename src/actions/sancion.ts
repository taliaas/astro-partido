import { defineAction, ActionError } from "astro:actions";
import { z } from "zod";
import { getSession } from "auth-astro/server.ts";
import { API_URL } from "astro:env/client";

const estado = [
  "PENDIENTE", 
  "APROBADA_NUCLEO", 
  "APROBADA_COMITE_MUNICIPAL", 
  "APROBADA_COMITE_PARTIDO",
  "DENEGADA_NUCLEO",
  "DENEGADA_COMITE_PARTIDO",
  "DENEGADA_COMITE_MUNICIPAL",
  "CUMPLIDA"
] as const;

const severity = [
  "AMONESTACION", 
  "SEPARACION_CARGO", 
  "SUSPENSION_TEMPORAL", 
  "SEPARACION_FILAS", 
  "EXPULSION"
] as const;

export const createSancion = defineAction({
  input: z.object({
    causa: z.string().min(1, "La causa es requerida"),
    fecha: z.coerce.date(),
    severidad: z.enum(severity, {
      errorMap: () => ({ message: "Tipo de sanción inválido" })
    }),
    duracion: z.coerce.number().min(1, "La duración mínima es 1 mes").max(365, "La duración máxima es 365 meses"),
    estado: z.enum(estado).optional(),
    militant: z.object({ 
      id: z.coerce.number().int().positive("ID de militante inválido")
    }),
  }),
  async handler(
    { causa, fecha, severidad, duracion, estado, militant },
    context
  ) {
    const session: any = await getSession(context.request);
    if (!session) {
      throw new ActionError({ 
        code: "UNAUTHORIZED",
        message: "Debe iniciar sesión para realizar esta acción"
      });
    }

    const militantId = Number(militant.id);
    if (isNaN(militantId)) {
      throw new ActionError({ 
        code: "BAD_REQUEST", 
        message: "ID de militante inválido" 
      });
    }

    // Convertir fecha a formato YYYY-MM-DD en UTC
    const fechaStr = fecha.toISOString().split('T')[0];

    const body = JSON.stringify({
      causa,
      fecha: fechaStr,
      severidad: severidad || "AMONESTACION", 
      duracion: Number(duracion),
      estado: estado || "PENDIENTE",
      militant: { id: militantId },
    });

    console.log("Enviando al backend:", body);

    const res = await fetch(`${API_URL}/sancion`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error del backend:", errorText);
      throw new ActionError({ 
        code: "BAD_REQUEST", 
        message: `Error al crear sanción: ${errorText}` 
      });
    }
    
    return res.json();
  },
});

export const updateSancion = defineAction({
  input: z.object({
    id: z.number().int().positive("ID de sanción inválido"),
    causa: z.string().min(1, "La causa es requerida").optional(),
    fecha: z.coerce.date().optional(),
    severidad: z.enum(severity, {
      errorMap: () => ({ message: "Tipo de sanción inválido" })
    }).optional(),
    duracion: z.coerce.number().min(1).max(365).optional(),
    estado: z.enum(estado, {
      errorMap: () => ({ message: "Estado de sanción inválido" })
    }).optional(),
    militant: z.object({ 
      id: z.coerce.number().int().positive() 
    }).optional(),
  }),
  async handler(
    { id, causa, fecha, severidad, duracion, estado, militant },
    context
  ) {
    const session: any = await getSession(context.request);
    if (!session) {
      throw new ActionError({ 
        code: "UNAUTHORIZED",
        message: "Debe iniciar sesión para realizar esta acción"
      });
    }

    const updateData: any = {};
    if (causa !== undefined) updateData.causa = causa;
    if (fecha !== undefined) updateData.fecha = fecha.toISOString();
    if (severidad !== undefined) updateData.severidad = severidad;
    if (duracion !== undefined) updateData.duracion = Number(duracion);
    if (estado !== undefined) updateData.estado = estado;
    if (militant !== undefined) {
      const militantId = Number(militant.id);
      updateData.militant = { id: militantId };
    }

    const body = JSON.stringify(updateData);
    console.log("Actualizando sanción:", body);

    const res = await fetch(`${API_URL}/sancion/${id}`, {
      method: "PUT",
      body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error del backend:", errorText);
      throw new ActionError({ 
        code: "BAD_REQUEST", 
        message: `Error al actualizar sanción: ${errorText}` 
      });
    }
    
    return res.json();
  },
});

export const exportSancion = defineAction({
  input: z.object({ 
    id: z.number().int().positive("ID de sanción inválido") 
  }),
  handler: async ({ id }, context) => {
    const session: any = await getSession(context.request);
    if (!session) {
      throw new ActionError({ 
        code: "UNAUTHORIZED",
        message: "Debe iniciar sesión para realizar esta acción"
      });
    }

    const res = await fetch(`${API_URL}/sancion/${id}/export`, {
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
      filename: `sancion_${id}.pdf`
    };
  }
});

// ✅ ACTUALIZADO: Exportar listado de sanciones con filtros adicionales
export const exportListadoSanciones = defineAction({
  input: z.object({
    estado: z.string().optional(),
    nucleoId: z.string().optional(),
    severidad: z.string().optional(), // ✅ NUEVO
    fecha: z.string().optional(), // ✅ NUEVO
    duracion: z.number().optional(), // ✅ NUEVO
  }),
  handler: async ({ estado, nucleoId, severidad, fecha, duracion }, context) => {
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
    if (severidad) params.append('severidad', severidad); // ✅ NUEVO
    if (fecha) params.append('fecha', fecha); // ✅ NUEVO
    if (duracion) params.append('duracion', String(duracion)); // ✅ NUEVO

    const url = `${API_URL}/sancion/export/listado${params.toString() ? `?${params.toString()}` : ''}`;

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
      ? `sanciones_${estado.toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`
      : `sanciones_todas_${new Date().toISOString().split('T')[0]}.pdf`;
    
    return { 
      pdf: base64,
      filename
    };
  }
});