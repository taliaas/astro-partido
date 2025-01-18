import type {Status} from "@/enum/Status.ts";

export default interface MinutePolitical {
    id: number;
    name: string;
    status: Status
    core: any
    fecha: Date;
    hora: Timestamp;
    lugar: string;
    createdAt: Date;
    total: number;
    ausentes: number;
    porciento: number;
    total_trabajador: number;
    total_organismo: number;
    causa: string[];
    tema: string;
    planteamientos: string[];
    acuerdos: string;
    valoracion: string;
    name_orientador: string;
    name_secretario: string;
}