import type { Militant } from "@/interface/Militante";

export interface CPDevelopment {
  id: number;
  militant: Militant;
  argument: string;
}
export interface MinutePolitical {
  id: string;
  topic: string;
  development: CPDevelopment[];
}
