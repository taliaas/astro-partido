export default interface MinuteOrdinary {
    id: number;
    createdAt: Date;
    fecha: Date;
    fechaProx: Date;
    fechaPrep: Date;
    fechaCP: Date;
    hora: string;
    lugar: string;
    core: string;
    secretarioGeneral: string;
    abscents: string[];
    order: string[];
    agreements: string[];
    extranjero: string[];
    observ: string;
}