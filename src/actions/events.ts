import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/server";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";

export const createEvent = defineAction({
  input: z.object({
    title: z.string(),
    type: z
      .string()
      .refine((val) => ["Evento", "Tarea", "Reunion", "Otro"].includes(val))
      .transform((val) => val.toString()),
    date: z.string().date(),
  }),
  async handler(input, context) {
    const session = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/event`, {
      method: "POST",
      body: JSON.stringify(input),
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

export const getEvents = defineAction({
  input: z.object({
    date: z.coerce.date(),
  }),
  async handler({ date }, context) {
    const response = await fetch(`${API_URL}/event/date/${date}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
});
