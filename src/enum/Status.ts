export enum UserStatus {
  Activo = "ACTIVO",
  Inactivo = "INACTIVO",
  Pendiente = "PENDIENTE", //cuando el militante no ha iniciado nunca sesion
}

export enum AgreementStatus {
  PENDIENTE = "Pendiente",
  COMPLETADA = "Completada",
  PARCIALMENTE_COMPLETADA = "Parcialmente Completada",
  CANCELADA = "Cancelada",
}

export enum Sexo {
  F = "Femenino",
  M = "Masculino",
  O = "Otro",
}

export enum Raza {
  N = "Negra",
  B = "Blanca",
  M = "Meztizo",
}

export enum Clasificacion {
  TM = "TÉCNICOS MEDIOS",
  PM = "PROFESORES Y MAESTROS",
  DA = "DIRIGENTES ADMINISTRATIVOS",
  TP = "TRABAJADORES DE PRESTACION ",
  E = "ESTUDIANTE",
  O = "OBREROS",
  TA = "TRABAJADORES ADMINISTRATIVOS",
  TPS = "TRAB. DE PREST. DE SERVICIOS",
  TTP = "TRABAJADORES DE CALIF. DE TEC. O PROF.",
  TMP = "TRABAJADORES CON CALIF. DE TEC. MEDIO O PROF.",
  TCP = "TRABAJADORES POR CUENTA PROPIA",
}
