import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/client";
import { getSession } from "auth-astro/server";
import { z } from "zod";

const Estado = ["Pendiente", "Completado"] as const;

export const createTransfer = defineAction({
  input: z.object({
    origen: z.string().min(3),
    destino: z.string().min(3),
    details: z.string().min(1),
    date: z.coerce.date(),
    estado: z.enum(Estado),
    militante: z.object({ 
      id: z.coerce.number(),
      core: z.object({
        id: z.number(),
        name: z.string()
      }).nullable().optional()
    }).nullable().optional(),
    tipoMilitante: z.string().optional(),
    tipoTraslado: z.enum(["interno", "externo"]).optional(),
    nombreMilitanteExterno: z.string().optional(),
  }),
  async handler(input, context) {

    const session: any = await getSession(context.request);
    
    if (!session) {
      throw new ActionError({ code: "UNAUTHORIZED" });
    }

    const {
      origen,
      destino,
      date,
      estado,
      militante,
      details,
      tipoMilitante,
      tipoTraslado,
      nombreMilitanteExterno,
    } = input;

    try {
      const body = {
        origen,
        destino,
        date,
        estado,
        details,
        militante,
        tipoMilitante,
        tipoTraslado,
        nombreMilitanteExterno,
      };

      const res = await fetch(`${API_URL}/transfer`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ ERROR RESPONSE:", errorText);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error ${res.status}: ${errorText}`
        });
      }
      
      const data = await res.json();
      return data;
      
    } catch (error: any) {
      throw error;
    }
  },
});

export const updateTransfer = defineAction({
  input: z.object({
    id: z.number(),
    origen: z.string().min(3).optional(),
    destino: z.string().min(3).optional(),
    details: z.string().optional(),
    date: z.coerce.date().optional(), 
    estado: z.enum(Estado).optional(),
    militante: z.object({ id: z.coerce.number() }).optional(),  
    tipoTraslado: z.enum(["interno", "externo"]).optional(),
  }),
  async handler(
    { id, origen, destino, date, estado, militante, details, tipoTraslado },
    context,
  ) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    try {
      const body: any = {
        origen,
        destino,
        date: date?.toISOString(), 
        estado,
        details,
        tipoTraslado,
      };

      if (militante && militante.id) {
        body.militante = militante;  
      }

      const res = await fetch(`${API_URL}/transfer/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ ERROR UPDATE:", errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      return await res.json();
    } catch (error) {
      console.error("❌ ERROR UPDATE:", error);
      throw error;
    }
  },
});

export const exportTransfer = defineAction({
  input: z.object({ id: z.number().int().positive() }),
  handler: async ({ id }, context) => {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/transfer/${id}/export`, {
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error al generar el PDF: ${errorText}`,
      });
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      pdf: base64,
      filename: `traslado_${id}.pdf`,
    };
  },
});

export const exportListadoTransfers = defineAction({
  input: z.object({
    estado: z.string().optional(),
    nucleoId: z.string().optional(),
    fecha: z.string().optional(), 
  }),
  handler: async ({ estado, nucleoId, fecha }, context) => {
    const session: any = await getSession(context.request);
    if (!session)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Debe iniciar sesión para realizar esta acción",
      });

    // Construir URL con parámetros de filtro
    const params = new URLSearchParams();
    if (estado) params.append("estado", estado);
    if (nucleoId) params.append("nucleoId", nucleoId);
    if (fecha) params.append("fecha", fecha); // ✅ NUEVO

    const url = `${API_URL}/transfer/export/listado${params.toString() ? `?${params.toString()}` : ""}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error al generar el PDF: ${errorText}`,
      });
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const filename = estado
      ? `traslados_${estado.toLowerCase()}_${new Date().toISOString().split("T")[0]}.pdf`
      : `traslados_todos_${new Date().toISOString().split("T")[0]}.pdf`;

    return {
      pdf: base64,
      filename,
    };
  },
});