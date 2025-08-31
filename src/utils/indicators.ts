export type Category = (typeof categories)[number];
export const categories = [
    "Asistencia",
    "Gestión",
    "Acuerdos",
    "Política",
    "Evaluación",
    "Organización",
] as const;

interface IndicatorItem {
    category: Category;
    name: string;
    description: string;
    chartType?: 'bar' | 'line' | 'donut'
}

export type Indicators = (typeof indicators)
export const indicators = {
    asistencia: {
        category: "Asistencia",
        name: "Asistencia",
        description: "Relación de asistencia",
        chartType: "line"
    },
    reason: {
        category: "Asistencia",
        name: "Causas de ausencias",
        description: "Estado de Causas de Ausencias",
        chartType: "line"
    },
    ptos: {
        category: "Gestión",
        name: "Orden del Día",
        description: "Puntos del orden del día",
        chartType: "line"
    },
    totalDeAcuerdos: {
        category: "Acuerdos",
        name: "Total de Acuerdos",
        description: "Total de acuerdos tomados",
        chartType: "line"
    },
    participacionOrgSup_Cte: {
        category: "Asistencia",
        name: "Participantes de la Org. Sup. del comité",
        description: "Participantes de la organización superior de comité",
        chartType: "bar"
    },
    participacionOrgSup_Mun: {
        category: "Asistencia",
        name: "Participantes de la Org. Sup. del Municipio",
        description: "Participantes de la organización superior del Municipio",
        chartType: "bar"
    },
    invitados: {
        category: "Asistencia",
        name: "Invitados",
        description: "Invitados a la reunión",
        chartType: "bar"
    },
    cp: {
        category: "Política",
        name: "Círculo Político",
        description: "Reunión de círculo de estudio",
    },
    cp_agree: {
        category: "Política",
        name: "Acuerdos del Círculo Político",
        description: "Acuerdos dentro del círculo político",
        chartType: "line"
    },
    usoComisiones: {
        category: "Organización",
        name: "Uso de Comisiones",
        description: "Uso y funcionamiento de comisiones",
    },
    implOrtcsOrgSup: {
        category: "Gestión",
        name: "Implementación ORTCS",
        description: "Implementación de estrategias ORTCS en la organización superior",
    },
    analisisActFtal: {
        category: "Evaluación",
        name: "Análisis de la Actividad Fundamental",
        description: "Análisis de actividades fundamentales",
    },
    discusionDelitoCorrupcionIlegalidad: {
        category: "Política",
        name: "Discusión Delito Corrupción",
        description: "Discusión sobre delitos y corrupción",
    },
    analisisObjs: {
        category: "Evaluación",
        name: "Análisis de Objetivos",
        description: "Evaluación y análisis de objetivos estratégicos",
    },
    politicaDeCuadros: {
        category: "Gestión",
        name: "Política de Cuadros",
        description: "Políticas de cuadros y liderazgo",
    },
    atencionFEU: {
        category: "Organización",
        name: "Atención FEU",
        description: "Atención a la Federación Estudiantil Universitaria",
        chartType: "bar"
    },
    atencionUJC: {
        category: "Organización",
        name: "Atención UJC",
        description: "Atención a la Unión de Jóvenes Comunistas",
        chartType: "bar"
    },
    funcionamientoSindicato: {
        category: "Organización",
        name: "Funcionamiento del Sindicato",
        description: "Evaluación del funcionamiento sindical",
        chartType: "bar"
    },
    reglamentosEstatutos: {
        category: "Gestión",
        name: "Reglamentos y Estatutos",
        description: "Revisión y aplicación de reglamentos y estatutos",
    },
    analisisAusenciasRO: {
        category: "Asistencia",
        name: "Análisis de Ausencias RO",
        description: "Evaluación de ausencias en reuniones oficiales",
        chartType: "line"
    },
    otrosAnalisisDisciplinarios: {
        category: "Evaluación",
        name: "Otros Análisis Disciplinarios",
        description: "Evaluación de otros aspectos disciplinarios",
        chartType: "line"
    },
    planDeTrabajo: {
        category: "Gestión",
        name: "Plan de Trabajo",
        description: "Planificación y seguimiento de tareas",
    },
    sanciones: {
        category: "Gestión",
        name: "Sanciones",
        description: "Registro y control de sanciones",
        chartType: "bar"
    },
    crecimiento: {
        category: "Organización",
        name: "Crecimiento",
        description: "Indicadores de crecimiento organizacional",
    },
    desactivacion: {
        category: "Organización",
        name: "Desactivaciones",
        description: "Registro de miembros desactivados",
        chartType: "bar"
    },
    evaluacion: {
        category: "Evaluación",
        name: "Evaluación",
        description: "Evaluación general del desempeño",
    },
    guardiaPCC: {
        category: "Organización",
        name: "Guardia PCC",
        description: "Guardias programadas en el PCC",
    },
    acuerdosSalidasExternas: {
        category: "Acuerdos",
        name: "Acuerdos de Salidas Externas",
        description: "Acuerdos relacionados con salidas externas",
        chartType: "bar"
    },
    trasladosIncorporacion: {
        category: "Organización",
        name: "Traslados e Incorporaciones",
        description: "Registro de traslados e incorporaciones",
        chartType: "bar"
    },
    rendicionMilitante: {
        category: "Evaluación",
        name: "Rendición de militantes",
        description: "Rendición de militantes",
        chartType: "bar"
    },
    rendicionDirigente: {
        category: "Evaluación",
        name: "Rendición de dirigentes",
        description: "Rendición de dirigentes",
        chartType: "bar"
    },
    rendicionOrganizacionesYOtros: {
        category: "Evaluación",
        name: "Rendición de organizaciones y otros",
        description: "Rendición de organizaciones y otros",
        chartType: "bar"
    },
} as const satisfies Record<string, IndicatorItem>;