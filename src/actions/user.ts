import { ActionError, defineAction } from "astro:actions";
import { z } from "zod";
import { API_URL } from "astro:env/client";
import { getSession } from "auth-astro/server.ts";
import { roleEnum } from "@/enum/roleEnum";

export const updateUser = defineAction({
  input: z.object({
    id: z.coerce.string(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    role: z.string().optional(),
  }),
  async handler({ id, ...input }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session?.jwt,
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  },
});

export const activeUser = defineAction({
  input: z.object({
    id: z.string(),
  }),
  handler: async ({ id }, context) => {
    const session: any = await getSession(context.request);
    const res = await fetch(`${API_URL}/user/activate/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session?.jwt,
      },
    });
    if (!res.ok) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: `HTTP error! status: ${res.status}`,
      });
    }
    return res.json();
  },
});

export const deactiveUser = defineAction({
  input: z.string(),
  handler: async (input, context) => {
    const session: any = await getSession(context.request);
    const res = await fetch(`${API_URL}/user/deactivate/${input}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session?.jwt,
      },
    });
    if (!res.ok) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: `HTTP error! status: ${res.status}`,
      });
    }
    return res.json();
  },
});
