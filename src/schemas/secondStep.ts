import { z } from "zod"

export const secondStepSchema = z.object({
  order: z.array(
    z.object({
      description: z.string().min(3, "La descripción debe tener al menos 3 caracteres")
    })
  ).min(1, "Debe agregar al menos un punto en el orden del día"),
  chequeo: z.string().min(10, "El chequeo debe tener al menos 10 caracteres"),
  orientaciones: z.string().min(10, "Las orientaciones deben tener al menos 10 caracteres"),
  analisis: z.string().min(10, "El análisis debe tener al menos 10 caracteres")
})
