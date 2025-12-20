import { Cargo } from "@/enum/Cargo.ts";
import type Minute from "@/interface/Minute";

export interface Invitados {
  id: string;
  nombre: string;
  cargo: Cargo;
  minute: Minute;
}
