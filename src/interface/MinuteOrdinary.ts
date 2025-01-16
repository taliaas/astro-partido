import {Status} from "@/enum/Status.ts";
import type {Invitados} from "@/interface/Invitados.ts";
import type {Asistencia} from "@/interface/Asistencia.ts";

export default interface MinuteOrdinary {
    id: number;
    name: string;
    status: Status
    computo: number;
    fecha: any;
    fechaProx: any;
    fechaPrep: any;
    fechaCP: any;
    hora: string;
    lugar: string;
    core: string;
    secretarioGeneral: string;
    abscents: Asistencia[];
    order: string[];
    agreements: string[];
    extranjero: string[];
    militante: any[];
    invitados: Invitados[];
    participantes: string[];
    orientaciones: string;
}