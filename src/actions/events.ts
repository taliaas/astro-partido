import EventServices from "@/services/EventServices";
import { ActionError, defineAction } from "astro:actions";
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
    const service = new EventServices();
    return service.createEventF(input, session.jwt);
  },
});
