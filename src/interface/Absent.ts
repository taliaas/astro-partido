export enum Reason {
    ENF = "Enfermedad",
    EXT = "Extranjero",
    TRAB = "Trabajo",
    FP = "Fuera de Provincia",
    Vac = "Vacaciones",
    LM = "Lic. de Maternidad",
    PP = "Problemas Personales",
    PF = "Problemas Familiares",
    Mov = "Movilizado",
    Inj = "Injustificado",
    Otr = "Otros",
}

export interface AttendanceResponse {
    attendances: Array<{
        core: string;
        creationDate: string;
        deliveryDate: string;
        total: number;
        absents: number;
        attendance: number;
        percent: number;
        reasons: Array<Reason>;
    }>;

    reasons: Record<Reason, number>;
}