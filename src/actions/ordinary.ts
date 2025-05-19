import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/server";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";

export const createMinute = defineAction({
  input: z.object({
    data: z.any(),
    abscents: z.any().array(),
    invitados: z.any().array(),
    agreements: z.any().array(),
    extranjero: z.any().array(),
  }),
  async handler(input, context) {
    const session = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/minutes-ordinary`, {
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
    id: z.string(),
    data: z.any(),
  }),
  async handler({ id, data }, context) {
    const session = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/minutes-ordinary/${id}`, {
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

export const deleteMinute = defineAction({
  input: z.string(),
  async handler(id, context) {
    const session = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/minutes-ordinary/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
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
    const session = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const response = await fetch(
      `${API_URL}/minutes-ordinary/status/${id}/${status}`,
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
