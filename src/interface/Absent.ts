export default interface AbsentInterface {
    id: number;
    core: number;
    mili: number;
    aus: number;
    pres: number;
    reason: string; //rectificar el tipo
    porciento: number;
    note: string;
    fecha: Date;
    entrega: Date;
}