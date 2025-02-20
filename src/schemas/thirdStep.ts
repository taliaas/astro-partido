
import { z } from "zod"

const currentDate = new Date()

export const thirdStepSchema = z.object({
  agreements: z.array(
    z.object({
      description: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
      responsible: z.string().min(3, "El responsable debe tener al menos 3 caracteres"),
      date: z.string().refine(date => new Date(date) >= currentDate, "La fecha no puede ser anterior a hoy")
    })
  ).min(1, "Debe agregar al menos un acuerdo"),
  
  travels: z.array(
    z.object({
      name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
      reason: z.string().min(3, "El motivo debe tener al menos 3 caracteres"),
      destination: z.string().min(2, "El destino debe tener al menos 2 caracteres"),
      dates: z.object({
        ida: z.string().refine(date => new Date(date) >= currentDate, "La fecha de ida no puede ser anterior a hoy"),
        regreso: z.string().refine(date => new Date(date) >= currentDate, "La fecha de regreso no puede ser anterior a hoy")
      }),
      status: z.enum(["Pendiente", "Aprobado", "Rechazado"])
    })
  ),

  observaciones: z.string().min(10, "Las observaciones deben tener al menos 10 caracteres"),
  proximaReunion: z.string().refine(date => new Date(date) >= currentDate, "La fecha no puede ser anterior a hoy"),
  preparacionReunion: z.string().refine(date => new Date(date) >= currentDate, "La fecha no puede ser anterior a hoy"),
  circuloEstudios: z.string().refine(date => new Date(date) >= currentDate, "La fecha no puede ser anterior a hoy")
})
