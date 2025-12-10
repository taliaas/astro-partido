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
