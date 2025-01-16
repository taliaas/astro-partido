import {Cargo} from "@/enum/Cargo.ts";
import type MinutesOrdinary from "./MinuteOrdinary.ts";

export interface Invitados {
    nombre: string
    cargo: Cargo
    minute: MinutesOrdinary;
}