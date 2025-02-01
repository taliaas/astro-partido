<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header and Selector -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-bold mb-6">Análisis por Indicador</h1>

        <div class="flex gap-4">
          <select
            v-model="selectedIndicator"
            class="w-full p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Seleccione un indicador</option>
            <option
              v-for="indicator in indicators"
              :key="indicator.key"
              :value="indicator.key"
            >
              {{ indicator.name }}
            </option>
          </select>
          <input
            type="month"
            v-model="selectedMonth"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Indicators List -->
      <div class="bg-white rounded-lg shadow-sm p-6" v-if="!selectedIndicator">
        <h2 class="text-xl font-semibold mb-4">Todos los Indicadores</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="indicator in indicators"
            :key="indicator.key"
            @click="selectedIndicator = indicator.key"
            class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <h3 class="font-medium text-lg">{{ indicator.name }}</h3>
            <p class="text-gray-500 text-md">{{ indicator.description }}</p>
          </div>
        </div>
      </div>

      <!-- Selected Indicator Analysis -->
      <div v-else class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-semibold">
              {{ getSelectedIndicator.name }}
            </h2>
            <p class="text-gray-500 text-lg">{{ getSelectedIndicator.description }}</p>
          </div>
          <button
            @click="selectedIndicator = ''"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- Nucleos List -->
        <div class="space-y-2">
          <div v-for="category in comite" :key="category">
            <h3 class="font-medium text-gray-700 mb-2">{{ category.name }}</h3>
            <div class="space-y-2">
              <div
                v-for="nucleo in category?.core"
                :key="nucleo.name"
                class="flex items-center justify-between p-3 rounded-lg bg-gray-100"
              >
                <span class="">
                  {{ nucleo.name }}
                </span>
                <div class="flex gap-2">
                  <span class="font-medium"> Total: </span>
                  <p class="text-gray-600">{{ getComputo(nucleo) }} </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { XIcon } from "lucide-vue-next";

const selectedIndicator = ref("");
const selectedMonth = ref("2025-01");
const { comite, computo } = defineProps<{
  comite: any[];
  computo: any;
}>();

const indicators = [
  {
    key: "asistencia",
    name: "Asistencia",
    description: "Relación de asistencia",
  },
  {
    key: "pto",
    name: "Orden del Día",
    description: "Puntos del orden del día",
  },
  {
    key: "totalDeAcuerdos",
    name: "Total de Acuerdos",
    description: "Total de acuerdos tomados",
  },
  {
    key: "participacionOrgSup",
    name: "Particip. de Org. Superior",
    description: "Participantes de la organización superior",
  },
  { key: "invitados", name: "Invitados", description: "Invitados a la reunión" },
  { key: "cp", name: "Círculo Político", description: "Reunión de círculo de estudio" },
  {
    key: "cp_agree",
    name: "Acuerdos del Círculo Político",
    description: "Acuerdos dentro del círculo político",
  },
  {
    key: "rendicionMilitante",
    name: "Rendición Militante",
    description: "Rendición de cuentas de militantes",
  },
  {
    key: "rendicionDirigente",
    name: "Rendición Dirigente",
    description: "Rendición de cuentas de dirigentes",
  },
  {
    key: "usoComisiones",
    name: "Uso de Comisiones",
    description: "Uso y funcionamiento de comisiones",
  },
  {
    key: "implOrtcsOrgSup",
    name: "Implementación ORTCS",
    description:
      "Implementación de estrategias ORTCS en la organización superior",
  },
  {
    key: "analisisActFtal",
    name: "Análisis Actividades",
    description: "Análisis de actividades fundamentales",
  },
  {
    key: "discusionDelitoCorrupcion",
    name: "Discusión Delito Corrupción",
    description: "Discusión sobre delitos y corrupción",
  },
  {
    key: "analisisObjs",
    name: "Análisis de Objetivos",
    description: "Evaluación y análisis de objetivos estratégicos",
  },
  {
    key: "politicaDeCuadros",
    name: "Política de Cuadros",
    description: "Políticas de cuadros y liderazgo",
  },
  {
    key: "atencionFEU",
    name: "Atención FEU",
    description: "Atención a la Federación Estudiantil Universitaria",
  },
  {
    key: "atencionUJC",
    name: "Atención UJC",
    description: "Atención a la Unión de Jóvenes Comunistas",
  },
  {
    key: "funcionamientoSindicato",
    name: "Funcionamiento del Sindicato",
    description: "Evaluación del funcionamiento sindical",
  },
  {
    key: "reglamentosEstatutos",
    name: "Reglamentos y Estatutos",
    description: "Revisión y aplicación de reglamentos y estatutos",
  },
  {
    key: "analisisAusenciasRO",
    name: "Análisis de Ausencias RO",
    description: "Evaluación de ausencias en reuniones oficiales",
  },
  {
    key: "otrosAnalisisDisciplinarios",
    name: "Otros Análisis Disciplinarios",
    description: "Evaluación de otros aspectos disciplinarios",
  },
  {
    key: "planDeTrabajo",
    name: "Plan de Trabajo",
    description: "Planificación y seguimiento de tareas",
  },
  {
    key: "sanciones",
    name: "Sanciones",
    description: "Registro y control de sanciones",
  },
  {
    key: "crecimiento",
    name: "Crecimiento",
    description: "Indicadores de crecimiento organizacional",
  },
  {
    key: "desactivacion",
    name: "Desactivaciones",
    description: "Registro de miembros desactivados",
  },
  {
    key: "evaluacion",
    name: "Evaluación",
    description: "Evaluación general del desempeño",
  },
  {
    key: "guardiaPCC",
    name: "Guardia PCC",
    description: "Guardias programadas en el PCC",
  },
  {
    key: "acuerdosSalidasExternas",
    name: "Acuerdos de Salidas Externas",
    description: "Acuerdos relacionados con salidas externas",
  },
  {
    key: "trasladosIncorporaciones",
    name: "Traslados e Incorporaciones",
    description: "Registro de traslados e incorporaciones",
  },
];

const getSelectedIndicator = computed(() => {
  return indicators.find((i) => i.key === selectedIndicator.value) || {};
});

const getComputo = (nucleo) => {
  const value = selectedMonth.value;
  const [year, month] = value.split("-");
  const indicator = selectedIndicator.value;

  const c = computo.find(
    (c) => c.mes == month && c.anno == year && c.nucleo.id === nucleo.id,
  );
  return c?.[indicator] ?? 0;
};
</script>
