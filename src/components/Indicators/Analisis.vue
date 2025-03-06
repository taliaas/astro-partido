<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-[1600px] mx-auto space-y-6">
      <!-- Header and Selector -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between p-2">
          <h1 class="text-2xl font-bold mb-6">Análisis por Indicador</h1>
          <a href="/indicator" class="px-2 p-2 rounded text-lg font-semibold flex">
            Gestionar</a>
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

      <!-- Indicators List -->
      <div class="bg-white rounded-lg shadow-sm p-6" v-if="!selectedIndicator">
        <h2 class="text-xl font-semibold mb-4">Todos los Indicadores</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="indicator in filteredIndicators"
            :key="indicator.key"
            @click="selected === true"
            class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <h3 class="font-medium text-xl">{{ indicator.name }}</h3>
            <p class="text-gray-500 text-lg">{{ indicator.description }}</p>
          </div>
        </div>
      </div>

      <!-- Selected Indicator Analysis -->
      <div v-else-if="selected" class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-semibold">
              {{ getSelectedIndicator.name }}
            </h2>
            <p class="text-gray-500 text-lg">
              {{ getSelectedIndicator.description }}
            </p>
          </div>
          <button
            @click="selected = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>

        <div
          class="flex justify-between"
          v-if="selectedIndicator === 'asistencia'"
        >
          <!--Asistencia -->
          <div class="w-full">
            <table class="p-2 w-full border border-gray-300">
              <table-header
                class="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
              >
                <tr>
                  <th
                    class="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Núcleo
                  </th>
                  <th
                    class="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha reunión
                  </th>
                  <th
                    class="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha entrega
                  </th>
                  <th
                    class="px-2 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    class="px-2 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Asistencia
                  </th>
                  <th
                    class="px-2 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ausente
                  </th>
                  <th
                    class="px-2 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Porciento
                  </th>
                </tr>
              </table-header>

              <tbody>
                <tr
                  v-for="asis in attendance.attendances"
                  :key="asis"
                  class="hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <th class="p-2 text-left font-normal px-4">
                    {{ asis.core }}
                  </th>
                  <th class="p-2 text-left font-normal px-4">
                    {{ asis.creationDate }}
                  </th>
                  <th class="p-2 text-left font-normal px-4">
                    {{ asis.deliveryDate }}
                  </th>
                  <th class="p-2 text-center font-normal px-4">
                    {{ asis.total }}
                  </th>
                  <th class="p-2 text-center font-normal">
                    {{ asis.attendance }}
                  </th>
                  <th class="p-2 text-center font-normal">
                    {{ asis.absents }}
                  </th>
                  <th class="p-2 text-center font-normal px-4">
                    {{ asis.percent }}%
                  </th>
                </tr>
              </tbody>
            </table>
            <div
              v-if="attendance.attendances.length === 0"
              class="p-4 border border-gray-300 text-md flex flex-col items-center justify-center"
            >
              <ClipboardIcon class="h-8 w-8 text-gray-400" />
              <h2 class="text-gray-500 font-medium">No hay asistencias</h2>
              <p class="text-gray-400">
                Los datos aparecerán aquí cuando estén disponibles
              </p>
            </div>
          </div>
        </div>
        <!-- Reason - Table Container with Horizontal Scroll -->
        <div
          v-else-if="selectedIndicator === 'reason'"
          class="w-full overflow-x-auto"
        >
          <table class="w-full min-w-[1200px]">
            <thead class="bg-gray-50 sticky top-0 border border-gray-300">
              <tr>
                <th
                  v-for="header in headers"
                  :key="header.id"
                  class="p-3 text-md font-medium text-gray-700 hover:bg-gray-100"
                >
                  {{ header.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-if="attendance.reasons.length">
                <tr
                  v-for="(row, index) in attendance.reasons"
                  :key="index"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td
                    v-for="header in headers"
                    :key="header.id"
                    class="p-3 text-sm text-center border-b first:pl-4 last:pr-4"
                  >
                    {{ row || "—" }}
                  </td>
                </tr>
              </template>

              <!-- Empty State -->
              <tr v-else>
                <td :colspan="headers.length" class="text-center">
                  <div
                    class="flex flex-col items-center justify-center border border-gray-300 p-4"
                  >
                    <ClipboardIcon class="h-8 w-8 text-gray-400" />
                    <p class="text-gray-500 text-md">
                      No hay causas de ausencias
                    </p>
                    <p class="text-gray-400 text-sm">
                      Los datos aparecerán aquí cuando estén disponibles
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Nucleos List -->
        <div v-if="selected" class="space-y-2">
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
                  <p class="text-gray-600">{{ getComputo(nucleo) }}</p>
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
import { ref, computed, watch } from "vue";
import { XIcon, ArrowRightIcon } from "lucide-vue-next";
import { ClipboardIcon, Search } from "lucide-vue-next";
import { Table, TableHeader } from "@/components/ui/table";
import OrdinaryService from "@/services/OrdinaryService.ts";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const selectedIndicator = ref("");
const selectedMonth = ref("2025-01");
const { comite, computo } = defineProps<{
  comite: any[];
  computo: any;
}>();

const selected = false
const search = ref("")
const indicators = [
  {
    key: "asistencia",
    name: "Asistencia",
    description: "Relación de asistencia",
  },
  {
    key: "reason",
    name: "Causas de ausencias",
    description: "Estado de Causas de Ausencias",
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
  {
    key: "invitados",
    name: "Invitados",
    description: "Invitados a la reunión",
  },
  {
    key: "cp",
    name: "Círculo Político",
    description: "Reunión de círculo de estudio",
  },
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
const attendance = ref([]);
const filteredIndicators = computed(() => {
  return (
    indicators.filter((ind) => ind.name.toLowerCase().includes(search.value.toLowerCase())) ||
    ind.description.toLowerCase().includes(search.value.toLowerCase())
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
