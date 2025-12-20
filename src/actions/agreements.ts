import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/client";
import { getSession } from "auth-astro/server";
import { z } from "zod";

export const deleteAgreement = defineAction({
  input: z.coerce.number(),
  async handler(id, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/agreements/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.jwt}`,
      },
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  },
});

export const editAgreements = defineAction({
  input: z.object({
    id: z.coerce.string(),
    data: z.object({
      descripcion: z.string(),
      responsable: z.object({ id: z.coerce.string() }),
      participants: z.object({ id: z.coerce.string() }).array(),
      created: z.coerce.date(),
      enddate: z.coerce.date(),
      status: z.string(),
      minute: z.object({ id: z.coerce.string() }),
      development: z.object({ id: z.coerce.string() }),
    }),
  }),
  async handler({ id, data }, context) {
    console.log("Agreements", data, id);

    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/agreements/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.jwt}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  },
});
