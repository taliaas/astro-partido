export enum Severity {
  CRITICAL = "Grave",
  HIGH = "Alto",
  MEDIUM = "Medio",
  LOW = "Bajo",
  INFO = "informativo",
  SUCCESS = "éxito",
  WARNING = "Advertencia",
}

export enum Severidad {
  LEVE = "LEVE",
  MEDIA = "MEDIA",
  GRAVE = "GRAVE",
}

export enum EstadoSancion {
  APROBADA = "APROBADA",
  DENEGADA = "DENEGADA",
  CUMPLIDA = "CUMPLIDA",
}

export enum EstadoDesactivacion {
  APROBADA = "APROBADA",
  RECHAZADA = "RECHAZADA",
}

export enum PlanStatus {
  CANCELADA = "Cancelada",
  PENDIENTE = "Pendiente",
  COMPLETADA = "Completada",
  PARCIALMENTE_COMPLETADA = "Parcialmente Completada",
}
export enum MinuteStatus {
  CREATE = "Creada", // Esperando procesamiento
  ERASER = "Borrador",
  PROCESSING = "Procesando",
  APROBADA = "Aprobada",
  PENDIENTE = "Pendiente",
  PROCESADA = "Procesada",
  ERROR = "Error",
  INACTIVA = "Inactiva",
}
export enum MinuteType {
  ro = "Ordinaria",
  cp = "Circulo Politico",
  ex = "Extraordinaria",
}
export enum StatusAtte {
  P = "Presente",
  A = "Ausente",
  V = "Virtual",
}
