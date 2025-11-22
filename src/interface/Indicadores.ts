import type { Invitados } from "@/interface/Invitados.ts";
import type Minute from "@/interface/Minute";
import type { indicators } from "@/utils/indicators";

export interface Indicator {
  id: string;
  key: keyof typeof indicators;
  value: number | null;
  text: string;
  sub: any;
}

export interface Computo {
  id: string;
  year: number;
  month: number;
  minute: Minute;
  indicators: Indicator[];
}
