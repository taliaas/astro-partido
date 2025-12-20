import type { Militant } from "@/interface/Militante";

export interface CPDevelopment {
  name: Militant;
  argument: string;
}
export interface MinutePolitical {
  id: string;
  topic: string;
  developments: CPDevelopment[];
}
