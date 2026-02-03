import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/client";
import { z } from "zod";
import { getSession } from "auth-astro/server";
import { EventStatus, EventType } from "@/enum/Event";
import { eventsSchema } from "@/components/Event/events-schema";

export const createEvent = defineAction({
  input: eventsSchema,
  async handler(input, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/events`, {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        Authorization: `Bearer ${session?.jwt}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
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
    const response = await fetch(`${API_URL}/events/date/${date}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
});

export const getAllEvents = defineAction({
  input: z.object({
    page: z.number(),
  }),
  async handler({ page }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const response = await fetch(`${API_URL}/events?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
});

export const deleteEvents = defineAction({
  input: z.object({
    id: z.number(),
  }),
  async handler({ id }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
});
