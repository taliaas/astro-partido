import type { Militant } from "@/interface/Militante";

export interface CauseDetails {
  count: number;
  total: number;
  militantes: Militant[];
  porcent: number;
}

export interface AbsentCausesWithMilitante {
  [cause: string]: {
    [comite: string]: {
      [nucleo: string]: CauseDetails;
    };
  };
}
