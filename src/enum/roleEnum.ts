export enum roleEnum {
  Admin = "Administrador",
  Gnral = "Secretario General del núcleo",
  Cmte = "Miembro del Comite CUJAE",
  mtte = "Militante",
}

export const MinuteType = [
  "Ordinaria",
  "Circulo Politico",
  "Extraordinaria",
] as const;

export const MinuteMode = ["Model", "Spacy"] as const;
