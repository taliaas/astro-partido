
import { z } from "zod"

export const minutesPolitSchema = z.object({
  lugar: z.string()
    .min(3, "El lugar debe tener al menos 3 caracteres")
    .regex(/^[a-zA-Z0-9\s]*$/, "Solo se permiten letras, números y espacios"),
  hora: z.string().min(1, "La hora es requerida"),
  fecha: z.string()
    .min(1, "La fecha es requerida")
    .refine((date) => new Date(date) <= new Date(), "La fecha no puede ser posterior a la actual"),
  total_organismo: z.number().min(0, "Debe ser un número mayor o igual que cero"),
  total_trabajador: z.number().min(0, "Debe ser un número mayor o igual que cero"),
  causa: z.array(z.object({
    nombre: z.string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .regex(/^[a-zA-Z\s]*$/, "Solo se permiten letras y espacios"),
    motivo: z.string().min(3, "El motivo debe tener al menos 3 caracteres")
  })),
  tema: z.string().min(10, "El tema debe tener al menos 10 caracteres"),
  planteamientos: z.string().min(20, "Los planteamientos deben tener al menos 20 caracteres"),
  valoracion: z.string().min(20, "La valoración debe tener al menos 20 caracteres"),
  name_orientador: z.string()
    .min(3, "El nombre del orientador debe tener al menos 3 caracteres")
    .regex(/^[a-zA-Z\s]*$/, "Solo se permiten letras y espacios"),
  name_secretario: z.string()
    .min(3, "El nombre del secretario debe tener al menos 3 caracteres")
    .regex(/^[a-zA-Z\s]*$/, "Solo se permiten letras y espacios")
})
