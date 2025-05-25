import { ActionError, defineAction } from "astro:actions";
import { z } from "zod";
import { getSession } from "auth-astro/server.ts";
import { API_URL } from "astro:env/client";

export const uploadMinutes = defineAction({
  accept: "form",
  input: z.object({
    files: z.any(),
    type: z.string().refine((val) => ["ro", "cp"].includes(val)),
  }),
  async handler({ files, type }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/minutes/upload?type=${type}`, {
      method: "POST",
      body: files,
      headers: {
        Authorization: `${session.jwt}`,
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },
});

export const deleteMinute = defineAction({
  input: z.object({
    id: z.number(),
    type: z.string().refine((val) => ["ro", "cp"].includes(val)),
  }),
  async handler({ id, type }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/minutes/delete/${id}?type=${type}`, {
      method: "DELETE",
      headers: {
        Authorization: `${session.jwt}`,
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },
});
