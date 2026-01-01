import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/client";
import { getSession } from "auth-astro/server";
import { z } from "zod";

export const createIndicator = defineAction({
  input: z.object({}),
  async handler(input, cotext) {},
});

export const getIndicatorById = defineAction({
  input: z.object({
    year: z.coerce.number(),
  }),
  async handler({ year }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    try {
      const response = await fetch(`${API_URL}/computo/reports/${year}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.jwt}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  },
});
