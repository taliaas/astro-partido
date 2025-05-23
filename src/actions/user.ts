import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { API_URL } from "astro:env/client";
import { getSession } from "auth-astro/server.ts";

export const deactiveUser = defineAction({
  input: z.number(),
  handler: async (input, context) => {
    const session:any = await getSession(context.request);
    const res = await fetch(`${API_URL}/user/deactivate/${input}`, {
      method: "PUT",
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
