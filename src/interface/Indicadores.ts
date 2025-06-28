import type {Invitados} from "@/interface/Invitados.ts";

export interface Indicadores{
    ptos: number;
    invitados: Invitados[]
    cp: number;
    cp_agree: number;
    totalDeAcuerdos: number;
    participacionOrgSup: number;
    rendicion: number;
    usoComisiones: number;
    implOrtcsOrgSup: number;
    analisisActFtal: number;
    discusionDelitoCorrupcion: number;
    analisisObjs: number;
    politicaDeCuadros: number;
    atencionFEU: number;
    atencionUJC: number;
    funcionamientoSindicato: number;
    reglamentosEstatutos: number;
    analisisAusenciasRO: number;
    otrosAnalisisDisciplinarios: number;
    planDeTrabajo: number;
    sanciones: number;
    crecimiento: number;
    desactivacion: number;
    evaluacion: number;
    guardiaPCC: number;
    acuerdosSalidasExternas: number;
    trasladosIncorporaciones: number;
}