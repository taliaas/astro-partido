import { ActionError, defineAction } from "astro:actions";
import { getSession } from "auth-astro/server.ts";
import { API_URL } from "astro:env/client";
import { z } from "astro:schema";

export const createCore = defineAction({
  input: z.object({
    name: z.string(),
    comite: z.object({ id: z.coerce.string() }),
  }),
  async handler(input, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/core`, {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        Authorization: `Bearer ${session?.jwt}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      console.log(data, data.statusCode);

      if (data.statusCode === 409) throw new Error(data.message);
      else throw new Error("Network response was not ok");
    }

    return data;
  },
});

export const updateCore = defineAction({
  input: z.object({
    id: z.coerce.string(),
    name: z.string().optional(),
    comite: z.object({ id: z.coerce.string() }).optional(),
    generalSecretary: z.coerce.string().optional(),
    operationSecretary: z.coerce.string().optional(),
  }),
  async handler({ id, ...input }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/core/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
      headers: {
        Authorization: `Bearer ${session?.jwt}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (!res.ok) {
      console.log(data);
      if (data.statusCode === 404) throw new Error(data.message);

      throw new Error("Network response was not ok");
    }
    return data;
  },
});

export const deleteCore = defineAction({
  input: z.coerce.string(),
  async handler(id, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/core/delete/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.jwt}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  },
});

export const enableCore = defineAction({
  input: z.coerce.string(),
  async handler(id, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/core/enable/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.jwt}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  },
});
