<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-[1600px] mx-auto space-y-6">
      <!-- Header and Selector -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between p-2">
          <h1 class="text-2xl font-bold mb-6">Análisis por Indicador</h1>
          <a href="/parte" class="px-2 p-2 rounded text-lg font-semibold flex">
            Parte Municipio</a
          >
        </div>

        <div class="flex gap-4">
          <div class="relative w-full">
            <Search
              class="left-3 top-1/2 -translate-y-1/2 size-3 text-gray-400 absolute"
            />
            <input
              v-model="search"
              placeholder="Buscar..."
              class="w-full p-2 border text-lg pl-10 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <input
            type="month"
            v-model="selectedMonth"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Indicators List with Collapsible Sections -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-sm" v-if="!selectedIndicator">
        <div class="p-4">
          <!-- Asistencia Section -->
          <Collapsible>
            <CollapsibleTrigger
                class="flex items-center w-full justify-between text-lg font-medium"
            >
              Asistencia
              <ChevronDownIcon class="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
              >
                <div
                    v-for="indicator in getIndicatorsByCategory('asistencia')"
                    :key="indicator.key"
                    @click="selectIndicator(indicator.key)"
                    class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div class="flex space-x-2">
                    <Checkbox
                        v-model="checked_indicator"
                        class="mt-2"
                    ></Checkbox>
                    <h3 class="font-medium text-xl">{{ indicator.name }}</h3>
                  </div>
                  <p class="text-gray-500 text-lg">
                    {{ indicator.description }}
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm" v-if="!selectedIndicator">
        <div class="p-4">
          <Collapsible>
            <CollapsibleTrigger
                class="flex items-center w-full justify-between text-lg font-medium"
            >
              Gestión
              <ChevronDownIcon class="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
              >
                <div
                    v-for="indicator in getIndicatorsByCategory('gestion')"
                    :key="indicator.key"
                    @click="selectIndicator(indicator.key)"
                    class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div class="flex space-x-2">
                    <Checkbox
                        v-model="checked_indicator"
                        class="mt-2"
                    ></Checkbox>
                    <h3 class="font-medium text-xl">{{ indicator.name }}</h3>
                  </div>
                  <p class="text-gray-500 text-lg">
                    {{ indicator.description }}
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ChevronDownIcon, Search } from "lucide-vue-next";
import OrdinaryService from "@/services/OrdinaryService.ts";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

const selectedIndicator = ref("");
const selectedMonth = ref("2025-01");
const { comite, computo } = defineProps<{
  comite: any[];
  computo: any;
}>();

const selected = false;
const search = ref("");
const checked_indicator = ref("");
const categories = {
  asistencia: ["asistencia", "reason"],
  gestion: ["pto", "totalDeAcuerdos", "participacionOrgSup", "invitados"],
  acuerdos: ["cp", "cp_agree", "acuerdosSalidasExternas"],
  politica: [
    "politicaDeCuadros",
    "atencionFEU",
    "atencionUJC",
    "funcionamientoSindicato",
    "reglamentosEstatutos",
  ],
  evaluacion: [
    "rendicionMilitante",
    "rendicionDirigente",
    "analisisActFtal",
    "discusionDelitoCorrupcion",
    "analisisObjs",
    "otrosAnalisisDisciplinarios",
    "evaluacion",
    "analisisAusenciasRO",
  ],
  organizacion: [
    "planDeTrabajo",
    "sanciones",
    "crecimiento",
    "desactivacion",
    "guardiaPCC",
    "trasladosIncorporaciones",
    "implOrtcsOrgSup",
    "usoComisiones",
  ],
};

const indicators = [
  {
    key: "asistencia",
    category: "",
    name: "Asistencia",
    description: "Relación de asistencia",
  },
  {
    key: "reason",
    category: "",
    name: "Causas de ausencias",
    description: "Estado de Causas de Ausencias",
  },
  {
    key: "pto",
    category: "",
    name: "Orden del Día",
    description: "Puntos del orden del día",
  },
  {
    category: "",
    key: "totalDeAcuerdos",
    name: "Total de Acuerdos",
    description: "Total de acuerdos tomados",
  },
  {
    category: "",
    key: "participacionOrgSup",
    name: "Particip. de Org. Superior",
    description: "Participantes de la organización superior",
  },
  {
    category: "",
    key: "invitados",
    name: "Invitados",
    description: "Invitados a la reunión",
  },
  {
    category: "",
    key: "cp",
    name: "Círculo Político",
    description: "Reunión de círculo de estudio",
  },
  {
    category: "",
    key: "cp_agree",
    name: "Acuerdos del Círculo Político",
    description: "Acuerdos dentro del círculo político",
  },
  {
    category: "",
    key: "rendicionMilitante",
    name: "Rendición Militante",
    description: "Rendición de cuentas de militantes",
  },
  {
    category: "",
    key: "rendicionDirigente",
    name: "Rendición Dirigente",
    description: "Rendición de cuentas de dirigentes",
  },
  {
    category: "",
    key: "usoComisiones",
    name: "Uso de Comisiones",
    description: "Uso y funcionamiento de comisiones",
  },
  {
    category: "",
    key: "implOrtcsOrgSup",
    name: "Implementación ORTCS",
    description:
      "Implementación de estrategias ORTCS en la organización superior",
  },
  {
    category: "",
    key: "analisisActFtal",
    name: "Análisis Actividades",
    description: "Análisis de actividades fundamentales",
  },
  {
    category: "",
    key: "discusionDelitoCorrupcion",
    name: "Discusión Delito Corrupción",
    description: "Discusión sobre delitos y corrupción",
  },
  {
    category: "",
    key: "analisisObjs",
    name: "Análisis de Objetivos",
    description: "Evaluación y análisis de objetivos estratégicos",
  },
  {
    category: "",
    key: "politicaDeCuadros",
    name: "Política de Cuadros",
    description: "Políticas de cuadros y liderazgo",
  },
  {
    category: "",
    key: "atencionFEU",
    name: "Atención FEU",
    description: "Atención a la Federación Estudiantil Universitaria",
  },
  {
    category: "",
    key: "atencionUJC",
    name: "Atención UJC",
    description: "Atención a la Unión de Jóvenes Comunistas",
  },
  {
    category: "",
    key: "funcionamientoSindicato",
    name: "Funcionamiento del Sindicato",
    description: "Evaluación del funcionamiento sindical",
  },
  {
    category: "",
    key: "reglamentosEstatutos",
    name: "Reglamentos y Estatutos",
    description: "Revisión y aplicación de reglamentos y estatutos",
  },
  {
    category: "",
    key: "analisisAusenciasRO",
    name: "Análisis de Ausencias RO",
    description: "Evaluación de ausencias en reuniones oficiales",
  },
  {
    category: "",
    key: "otrosAnalisisDisciplinarios",
    name: "Otros Análisis Disciplinarios",
    description: "Evaluación de otros aspectos disciplinarios",
  },
  {
    category: "",
    key: "planDeTrabajo",
    name: "Plan de Trabajo",
    description: "Planificación y seguimiento de tareas",
  },
  {
    category: "",
    key: "sanciones",
    name: "Sanciones",
    description: "Registro y control de sanciones",
  },
  {
    category: "",
    key: "crecimiento",
    name: "Crecimiento",
    description: "Indicadores de crecimiento organizacional",
  },
  {
    category: "",
    key: "desactivacion",
    name: "Desactivaciones",
    description: "Registro de miembros desactivados",
  },
  {
    category: "",
    key: "evaluacion",
    name: "Evaluación",
    description: "Evaluación general del desempeño",
  },
  {
    category: "",
    key: "guardiaPCC",
    name: "Guardia PCC",
    description: "Guardias programadas en el PCC",
  },
  {
    category: "",
    key: "acuerdosSalidasExternas",
    name: "Acuerdos de Salidas Externas",
    description: "Acuerdos relacionados con salidas externas",
  },
  {
    category: "",
    key: "trasladosIncorporaciones",
    name: "Traslados e Incorporaciones",
    description: "Registro de traslados e incorporaciones",
  },
];

// Función para obtener indicadores por categoría
const getIndicatorsByCategory = (category) => {
  new Map
  return indicators
    .filter((indicator) => categories[category].includes(indicator.key))
    .filter(
      (indicator) =>
        indicator.name.toLowerCase().includes(search.value.toLowerCase()) ||
        indicator.description
          .toLowerCase()
          .includes(search.value.toLowerCase()),
    );
};

const getSelectedIndicator = computed(() => {
  return indicators.find((i) => i.key === selectedIndicator.value) || {};
});
const attendance = ref([]);
const filteredIndicators = computed(() => {
  return (
    indicators.filter((ind) =>
      ind.name.toLowerCase().includes(search.value.toLowerCase()),
    ) || ind.description.toLowerCase().includes(search.value.toLowerCase())
  );
});
const headers = [
  { id: 1, name: "Núcleo" },
  { id: 2, name: "Enfermedad" },
  { id: 3, name: "Extranjero" },
  { id: 4, name: "Trabajo" },
  { id: 5, name: "Fuera de Provincia" },
  { id: 6, name: "Vacaciones" },
  { id: 7, name: "Lic. de Maternidad" },
  { id: 8, name: "Problemas Personales" },
  { id: 9, name: "Problemas Familiares" },
  { id: 10, name: "Movilizado" },
  { id: 11, name: "Injustificado" },
  { id: 12, name: "Otros" },
];
const getComputo = (nucleo) => {
  const value = selectedMonth.value;
  const [year, month] = value.split("-");
  const indicator = selectedIndicator.value;

  const c = computo.find(
    (c) => c.mes == month && c.anno == year && c.nucleo.id === nucleo.id,
  );
  return c?.[indicator] ?? 0;
};

async function getAttendance() {
  const service = new OrdinaryService();
  const value = selectedMonth.value;
  const [year, month] = value.split("-");
  try {
    attendance.value = await service.getAttendance(month, year);
  } catch (e) {
    console.log(e);
  }
}

watch(() => {
  getAttendance();
});
</script>
