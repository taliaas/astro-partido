import { Cargo } from "@/enum/Cargo.ts";
import type Minute from "@/interface/Minute";

export interface Invitados {
  id: number;
  nombre_apellidos: string;
  cargo: Cargo;
  minute: Minute;
}
