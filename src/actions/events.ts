import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/client";
import { z } from "zod";
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
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/event`, {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        Authorization: `Bearer ${session?.jwt}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json()
    console.log("Data: ", data)
    if (res.status === 401) {
      throw new ActionError({ code: "UNAUTHORIZED" });
    }

    return data;
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

export const getAllEvents = defineAction({
  input: z.object({
    page: z.number()
  }),
  async handler({ page }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const response = await fetch(`${API_URL}/event?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        }
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
});
