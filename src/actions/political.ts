import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/client";
import { z } from "zod";
import { getSession } from "auth-astro/server";

export const createMinute = defineAction({
  input: z.object({
    lugar: z.string(),
    hora: z.string().time(),
    fecha: z.string().date(),
    total_organismo: z.number().int(),
    total_trabajador: z.number().int(),
    ausentes: z.number().int(),
    causa: z.object({ nombre: z.string(), motivo: z.string() }).array(),
    tema: z.string(),
    planteamientos: z.string(),
    valoracion: z.string(),
    name_orientador: z.string(),
    name_secretario: z.string(),
    core: z.any(),
  }),
  async handler(input, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/minutes-political`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },
});

export const updateMinute = defineAction({
  input: z.object({
    id: z.number(),
    data: z.any(),
  }),
  async handler({ id, data }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/minutes-political/${id}`, {
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

export const updateStatusMinutes = defineAction({
  input: z.object({
    id: z.string(),
    status: z.string(),
  }),
  async handler({ id, status }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const response = await fetch(
      `${API_URL}/minutes-political/status/${id}/${status}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },
});

export const processMinute = defineAction({
  accept: "form",
  input: z.object({ file: z.instanceof(File) }),
  handler({ file }, context) {

  },
})
