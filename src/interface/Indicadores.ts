import type { Invitados } from "@/interface/Invitados.ts";
import type { indicators } from "@/utils/indicators";

export interface Indicator {
  id: string;
  key: keyof typeof indicators;
  value: number | null;
  text: string;
  sub: any;
}
