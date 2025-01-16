import {Reason} from "@/interface/Absent.ts";
import type MinutesOrdinary from "./MinuteOrdinary.ts";

export interface Asistencia {
    minute: MinutesOrdinary
    //militante: any
    reason: Reason
    notes: string
}