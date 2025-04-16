
export interface Militante {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    organization: string;
    estado: boolean;
    address: string;
    phone: string;
}

export interface CauseDetails {
    count: number;
    total: number;
    militantes: Militante[];
    porcent: number;
}

export interface AbsentCausesWithMilitante {
    [cause: string]: {
        [comite: string]: {
            [nucleo: string]: CauseDetails;
        };
    };
}