import { ActionError, defineAction } from "astro:actions";
import { z } from "zod";
import { getSession } from "auth-astro/server.ts";
import { API_URL } from "astro:env/client";
import MinutesService from "@/services/Minutes.ts";
import { MinuteMode, MinuteType } from "@/enum/roleEnum";

const enumStatus = [
  "Creada",
  "Procesando",
  "Pendiente",
  "Procesada",
  "Validada",
  "Invalida",
  "Inactiva",
] as const;

export const retryModel = defineAction({
  input: z.object({
    actaID: z.coerce.string(),
    mode: z.enum(["spacy", "model", "Spacy", "Model"]), 
  }),
  async handler({ actaID, mode }, ctx) {
    const session: any = await getSession(ctx.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    
    const normalizedMode = mode.charAt(0).toUpperCase() + mode.slice(1);
    
    const res = await fetch(
      `${API_URL}/minute/retry/${actaID}/${normalizedMode}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
      },
    );
    const data = await res.json();

    if (!res.ok) {
      throw new ActionError({ code: "UNAUTHORIZED", message: data.message });
    }
    return data;
  },
});

export const getMinutes = defineAction({
  input: z.object({
    page: z.number(),
    type: z.string(),
    order: z.string(),
    nombre: z.string().optional(),
    core: z.string().optional(),
    status: z.enum(enumStatus).optional(),
    fecha: z.string().optional(),
    limit: z.string().optional(),
  }),
  async handler(
    { page, type, order, nombre, core, status, fecha, limit },
    ctx,
  ) {
    const session = await getSession(ctx.request);
    const service = new MinutesService();
    return service.getAllMinutes(
      type,
      page,
      limit,
      session,
      order,
      nombre,
      core,
      status,
      fecha,
    );
  },
});

export const addObservation = defineAction({
  input: z.object({
    id: z.coerce.number(),
    observaciones: z.string(),
  }),
  async handler({ observaciones, id }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/minute/${id}/add-observations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify({ observaciones }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.statusCode === 400) throw new Error(data.message);
      if (data.statusCode === 401) throw new Error(data.message);
      if (data.statusCode === 500) throw new Error(data.message);
      throw new ActionError({ code: "UNAUTHORIZED", message: data.message });
    }
    return data;
  },
});

export const updateCore = defineAction({
  input: z.object({
    coreId: z.number(),
    minuteId: z.number(),
  }),
  async handler({ coreId, minuteId }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(
      `${API_URL}/minute/updateCore/${minuteId}/${coreId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.jwt}`,
        },
      },
    );
    
    const data = await res.json();
    
    if (!res.ok) {
      console.error('❌ Error del servidor:', data.message);
      throw new ActionError({ code: "UNAUTHORIZED", message: data.message });
    }
    return data;
  },
});

export const uploadMinutes = defineAction({
  accept: "form",
  input: z.object({
    files: z.any().array(),
    type: z
      .string()
      .refine((val) =>
        ["Ordinaria", "Circulo Politico", "Extraordinaria"].includes(val),
      ),
    mode: z.enum(["Spacy", "Model"]),
  }),
  async handler({ files, type, mode }, context) {
    const session: any = await getSession(context.request);

    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const formData = new FormData();
    files.forEach((f) => {
      formData.append("files", f);
    });
    
    //Usar API_URL en lugar de localhost:5000
    const res = await fetch(
      `${API_URL}/minute/upload?type=${type}&mode=${mode}`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${session.jwt}`,
        },
      },
    );
    const data = await res.json();

    if (!res.ok) {
      throw new ActionError({ 
        code: "INTERNAL_SERVER_ERROR", 
        message: data.message 
      });
    }
    return data;
  },
});

export const uploadMinutesA = defineAction({
  accept: "form",
  input: z.object({
    files: z.any().array(),
    type: z.string().refine((val) => 
      ["Ordinaria", "Circulo Politico", "Extraordinaria"].includes(val),
      { message: "Tipo de acta inválido" }
    ),
    mode: z.enum(["Spacy"]), // ✅ Solo Spacy con mayúscula inicial
  }),
  async handler({ files, type, mode }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    // ✅ Mapear nombres completos a códigos para el backend
    const typeMap: Record<string, string> = {
      "Ordinaria": "ro",
      "Circulo Politico": "cp",
      "Extraordinaria": "ex"
    };

    const formData = new FormData();

    for (const f of files) {
      if (typeof (f as any).name === 'string' && typeof (f as any).arrayBuffer === 'function') {
        formData.append("files", f as any, (f as any).name);
        continue;
      }

      const buffer = await (f as any).arrayBuffer?.() ?? new ArrayBuffer(0);
      const mime = (f as any).type || 'application/octet-stream';
      const blob = new Blob([buffer], { type: mime });
      formData.append("files", blob, (f as any).name ?? 'file');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 600000);

    try {
      // ✅ Convertir tipo a código y mode a minúsculas para la URL
      const typeCode = typeMap[type];
      const modeParam = mode.toLowerCase(); // "spacy"
      
      // ✅ URL corregida: /minute/upload/spacy (singular)
      const res = await fetch(`${API_URL}/minute/upload/${modeParam}?type=${typeCode}`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${session.jwt}` },
        signal: controller.signal
      });

      clearTimeout(timeout);
      const data = await res.json();

      if (!res.ok) {
        if (data?.missingField === 'date') {
          throw new ActionError({ 
            code: "BAD_REQUEST", 
            message: "MISSING_DATE"
          });
        }
        
        if (res.status === 403) {
          throw new ActionError({ 
            code: "FORBIDDEN", 
            message: data.message || "No tiene permisos para subir actas de este núcleo"
          });
        }

        if (res.status === 404) {
          throw new ActionError({ 
            code: "NOT_FOUND", 
            message: data.message || "No se pudo identificar el núcleo del documento"
          });
        }

        throw new ActionError({ 
          code: "BAD_REQUEST", 
          message: data.message || "Error al subir el acta"
        });
      }

      return { success: true, data };
      
    } catch (error) {
      clearTimeout(timeout);
      
      if (error instanceof ActionError) {
        throw error;
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ActionError({ 
          code: "REQUEST_TIMEOUT", 
          message: "La subida del archivo excedió el tiempo límite de 2 minutos"
        });
      }
      
      throw new ActionError({ 
        code: "INTERNAL_SERVER_ERROR", 
        message: "Error inesperado al subir el acta"
      });
    }
  },
});

export const deleteMinute = defineAction({
  input: z.object({
    id: z.coerce.string(),
  }),
  async handler({ id }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/minute/delete/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  },
});

export const createMinute = defineAction({
  input: z.object({
    data: z.any(),
    type: z.enum(MinuteType),
    mode: z.enum(MinuteMode),
  }),
  async handler({ data, type, mode, ...rest }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(
      `${API_URL}/minute/create?type=${type}&mode=${mode}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
        body: JSON.stringify({ ...data, ...rest }),
      },
    );
    const result = await res.json();

    if (!res.ok) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: result.message,
      });
    }

    return result;
  },
});

export const updateMinute = defineAction({
  input: z.object({
    id: z.coerce.number(),
    data: z.any(),
  }),
  async handler({ id, data }, context) {
    console.log(id);

    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/minute/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },
});


//Accion para obtener cualquier acta por ID (detecta automáticamente el tipo)
export const getMinuteById = defineAction({
  input: z.object({
    id: z.string(),
  }),
  async handler({ id }, ctx) {
    const session: any = await getSession(ctx.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    // Intentar obtener el acta desde el endpoint general
    const res = await fetch(`${API_URL}/minute/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${session.jwt}` },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new ActionError({ 
        code: "BAD_REQUEST", 
        message: data.message || "No se pudo obtener el acta"
      });
    }

    return { success: true, data };
  },
});

// Acción para obtener acta de Reunion Ordinaria por ID
export const getMinuteROById = defineAction({
  input: z.object({
    id: z.string(),
  }),
  async handler({ id }, ctx) {
    const session: any = await getSession(ctx.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/minutes-ordinary/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${session.jwt}` },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new ActionError({ 
        code: "BAD_REQUEST", 
        message: data.message || "No se pudo obtener el acta"
      });
    }

    return { success: true, data };
  },
});

// Acción para obtener acta de Círculo Político por ID
export const getMinuteCPById = defineAction({
  input: z.object({
    id: z.string(),
  }),
  async handler({ id }, ctx) {
    const session: any = await getSession(ctx.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/minutes-political/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${session.jwt}` },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new ActionError({ 
        code: "BAD_REQUEST", 
        message: data.message || "No se pudo obtener el acta"
      });
    }

    return { success: true, data };
  },
});
