import { EventStatus, EventType } from "@/enum/Event";
import { z } from "zod";

export type EventsData = z.infer<typeof eventsSchema>;
export const eventsSchema = z.object({
  id: z.number().nullable(),
  title: z.string().min(3, { message: "Ingrese un correo título válido" }),
  type: z.nativeEnum(EventType),
  status: z.nativeEnum(EventStatus),
  date: z.coerce.date(),
  time: z.coerce.string(),
  details: z.string(),
  place: z.string().min(3, { message: "Ingrese un lugar correcto" }),
  responsables: z.number().array().nullable(),
  read: z.boolean(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
});
