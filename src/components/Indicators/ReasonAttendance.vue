<template>
  <div>
    <!-- Selector de Dashboard -->
    <div class="mb-6">
      <div class="bg-white rounded-lg p-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-medium text-gray-900">Análisis de Inasistencias</h2>
            <p class="text-sm text-gray-500">Visualización y gestión de ausencias por comités y núcleos</p>
          </div>

          <div class="flex items-center gap-3">
            <Select v-model="selectedDashboard">
              <SelectTrigger class="w-[220px]">
                <SelectValue placeholder="Seleccionar dashboard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inasistencias-por-razon">Inasistencias por Razón</SelectItem>
                <SelectItem value="inasistencias-por-comite">Inasistencias por Comité</SelectItem>
                <SelectItem value="resumen-general">Resumen General</SelectItem>
                <SelectItem value="tendencias-mensuales">Tendencias Mensuales</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Dinámico -->
    <div v-if="selectedDashboard === 'inasistencias-por-razon'">
      <!-- Causas desplegables -->
      <div class="space-y-2">
        <div v-for="(reasonData, reason) in attendanceData.withMilitante?.reasons" :key="reason">
          <Collapsible>
            <CollapsibleTrigger
                class="flex justify-between items-center group w-full p-2 text-lg font-medium hover:bg-gray-100 bg-gray-50 border border-gray-300 rounded-md group transition-colors"
                :style="{ borderLeftColor: getReasonColor(getShortReasonKey(reason)), borderLeftWidth: '4px' }"
            >
              <div class="flex items-center">
                {{ reason }}
              </div>
              <div class="flex items-center gap-2">
                <div class="group-data-[state=closed]:hidden px-3 rounded-full">
                  <span class="text-foreground text-sm">
                    Total: {{ getTotalPorRazon(reason) }}
                  </span>
                </div>
                <ChevronDownIcon
                    class="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform"
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div class="divide-y divide-gray-200 border border-gray-200 rounded-md border-t-0">
                <!-- Datos por comité y núcleo -->
                <div v-if="reasonData.length === 0">
                  <span class="flex </div>p-2 py-4 justify-center text-gray-500 font-medium">No hay incidencias para esta razón</span>
                </div>
                <div v-else v-for="comite in reasonData" :key="comite.id" class="bg-white"><div class="p-3 bg-gray-50 font-medium text-sm flex justify-between">
                    <span>{{ comite.name }}</span>
                    <span>Total: {{ comite.total }}</span>
                  </div>
                  <div class="divide-y divide-gray-100">
                    <div
                        v-for="core in comite.cores"
                        :key="core.id"
                        class="flex justify-between items-center p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        @click="showNucleoDetails(core, reason, comite.name)"
                    >
                      <span class="text-sm">{{ core.name }}</span>
                      <Badge
                          :variant="core.militantes.length > 0 ? 'default' : 'outline'"
                          :class="core.militantes.length > 0 ? 'bg-opacity-90' : 'text-gray-400'"
                          :style="core.militantes.length > 0 ? { backgroundColor: getReasonColor(getShortReasonKey(reason)) } : {}"
                      >
                        {{ core.militantes.length }}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>

    <div v-else-if="selectedDashboard === 'inasistencias-por-comite'">
      <!-- Vista por comités -->
      <div class="space-y-4" v-if="attendanceData.withCommittes">
        <div v-for="(nucleos, comite) in attendanceData.withCommittes" :key="comite">
          <Collapsible>
            <CollapsibleTrigger
                class="flex justify-between items-center group w-full p-3 text-lg font-medium hover:bg-gray-100 bg-white border border-gray-200 rounded-md shadow-sm group transition-colors"
            >
              <div class="flex items-center">
                <FolderIcon class="h-5 w-5 mr-2 text-blue-600" />
                {{ comite }}
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline" class="bg-blue-50 text-blue-800">
                  {{ Object.keys(nucleos).length }} núcleos
                </Badge>
                <Badge variant="outline" class="bg-gray-50 text-gray-800">
                  {{ getTotalAusenciasPorComite(comite) }} ausencias
                </Badge>
                <ChevronDownIcon
                    class="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform"
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div class="mt-2 bg-white border border-gray-200 rounded-md shadow-sm">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Núcleo</th>
                    <th
                        v-for="(label, reason) in reasonLabels"
                        :key="reason"
                        scope="col"
                        class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        :title="label"
                    >
                      <span>{{ getShortReason(reason) }}</span>
                    </th>
                    <th scope="col" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(nucleoData, nucleo) in nucleos" :key="nucleo" class="hover:bg-gray-50 cursor-pointer" @click="showNucleoAllDetails(comite, nucleo)">
                    <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{ nucleo }}</td>
                    <td v-for="(label, reason) in reasonLabels" :key="reason" class="px-3 py-2 whitespace-nowrap text-sm text-center">
                      <Badge
                          v-if="nucleoData[reason] > 0"
                          :style="{ backgroundColor: getReasonColor(reason) }"
                          class="bg-opacity-90"
                      >
                        {{ nucleoData[reason] }}
                      </Badge>
                      <span v-else class="text-gray-400">0</span>
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-center font-medium">
                      {{ nucleoData.total || 0 }}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>

    <div v-else-if="selectedDashboard === 'resumen-general'">
      <!-- Resumen general -->
      <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-sm" v-if="attendanceData.withCommittes">
        <h3 class="text-lg font-medium mb-4">Resumen General de Inasistencias</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Gráfico de barras por causa -->
          <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 class="text-sm font-medium mb-2">Por causa</h4>
            <div class="space-y-2">
              <div v-for="(reason, index) in Object.keys(attendanceData.withMilitante?.reasons || {})" :key="index" class="flex items-center">
                <span class="text-xs w-16">{{ getShortReason(getShortReasonKey(reason)) }}</span>
                <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                      class="h-full rounded-full transition-all duration-500"
                      :style="{
                      width: `${getPercentByReason(reason)}%`,
                      backgroundColor: getReasonColor(getShortReasonKey(reason))
                    }"
                  ></div>
                </div>
                <span class="ml-2 text-xs font-medium">{{ getTotalPorRazon(reason) }}</span>
              </div>
            </div>
          </div>

          <!-- Tabla resumen por comité -->
          <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 class="text-sm font-medium mb-2">Por comité</h4>
            <div class="space-y-2">
              <div v-for="(nucleos, comite) in attendanceData.withCommittes" :key="comite" class="flex items-center justify-between border-b border-gray-100 pb-1">
                <span class="text-sm">{{ comite }}</span>
                <div class="flex items-center">
                  <span class="text-sm font-medium">{{ getTotalAusenciasPorComite(comite) }}</span>
                  <span class="text-xs text-gray-500 ml-1">({{ getPercentByComite(comite) }}%)</span>
                </div>
              </div>
              <div class="flex items-center justify-between pt-1 font-medium">
                <span>Total general</span>
                <span>{{ getTotalGeneral() }}</span>
              </div>
            </div>
          </div>

          <!-- Tabla de distribución por núcleo -->
          <div class="bg-gray-50 p-4 rounded-md border border-gray-200 md:col-span-2">
            <h4 class="text-sm font-medium mb-2">Distribución por núcleo</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                <tr>
                  <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comité</th>
                  <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Núcleo</th>
                  <th scope="col" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Distribución</th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <template v-for="(nucleos, comite) in attendanceData.withCommittes" :key="comite">
                  <tr v-for="(nucleoData, nucleo, index) in nucleos" :key="`${comite}-${nucleo}`" class="hover:bg-gray-50 cursor-pointer" @click="showNucleoAllDetails(comite, nucleo)">
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500" v-if="index === 0" :rowspan="Object.keys(nucleos).length">
                      {{ comite }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{ nucleo }}</td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-center font-medium">{{ nucleoData.total || 0 }}</td>
                    <td class="px-3 py-2">
                      <div class="flex h-4 rounded-full overflow-hidden w-full">
                        <template v-for="(label, reason) in reasonLabels" :key="reason">
                          <div
                              v-if="nucleoData[reason] > 0"
                              :style="{
                                width: `${(nucleoData[reason] / (nucleoData.total || 1)) * 100}%`,
                                backgroundColor: getReasonColor(reason)
                              }"
                              class="h-full"
                              :title="`${label}: ${nucleoData[reason]}`"
                          ></div>
                        </template>
                      </div>
                    </td>
                  </tr>
                </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Leyenda -->
        <div class="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 md:grid-cols-6 gap-2">
          <div v-for="(label, key) in reasonLabels" :key="key" class="flex items-center">
            <div
                class="w-3 h-3 rounded-full mr-2"
                :style="{ backgroundColor: getReasonColor(key) }"
            ></div>
            <span class="text-xs">{{ label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="selectedDashboard === 'tendencias-mensuales'">
      <!-- Dashboard de tendencias mensuales -->
      <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 class="text-lg font-medium mb-4">Tendencias Mensuales de Inasistencias</h3>
        <p class="text-gray-500 mb-6">Análisis de la evolución de inasistencias en los últimos 6 meses</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Gráfico de tendencias mensuales -->
          <div class="bg-gray-50 p-4 rounded-md border border-gray-200 md:col-span-2">
            <h4 class="text-sm font-medium mb-4">Evolución mensual por causa</h4>
            <div class="h-64 relative">
              <!-- Eje Y -->
              <div class="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between items-end pr-2">
                <span class="text-xs text-gray-500">100%</span>
                <span class="text-xs text-gray-500">75%</span>
                <span class="text-xs text-gray-500">50%</span>
                <span class="text-xs text-gray-500">25%</span>
                <span class="text-xs text-gray-500">0%</span>
              </div>

              <!-- Líneas de referencia horizontales -->
              <div class="absolute left-10 right-0 top-0 bottom-0 flex flex-col justify-between">
                <div class="border-t border-gray-200 h-0"></div>
                <div class="border-t border-gray-200 h-0"></div>
                <div class="border-t border-gray-200 h-0"></div>
                <div class="border-t border-gray-200 h-0"></div>
                <div class="border-t border-gray-200 h-0"></div>
              </div>

              <!-- Gráfico de líneas (simulado) -->
              <div class="absolute left-10 right-0 top-0 bottom-0 flex items-end">
                <div v-for="(month, index) in monthlyTrends" :key="index" class="flex-1 flex items-end justify-center">
                  <div class="relative w-full">
                    <div v-for="(value, reason) in month.data" :key="reason"
                         class="absolute bottom-0 left-0 right-0 transition-all duration-500"
                         :style="{
                        height: `${value}%`,
                        backgroundColor: getReasonColor(reason),
                        opacity: 0.7,
                        zIndex: 10 - index
                      }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Eje X (meses) -->
              <div class="absolute left-10 right-0 bottom-0 flex justify-between">
                <div v-for="(month, index) in monthlyTrends" :key="index" class="text-xs text-gray-500 text-center" style="width: 16.666%">
                  {{ month.label }}
                </div>
              </div>
            </div>
          </div>

          <!-- Tabla de tendencias -->
          <div class="bg-gray-50 p-4 rounded-md border border-gray-200 md:col-span-2">
            <h4 class="text-sm font-medium mb-4">Datos mensuales</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                <tr>
                  <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                  <th v-for="(label, reason) in reasonLabels" :key="reason" scope="col" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ getShortReason(reason) }}
                  </th>
                  <th scope="col" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(month, index) in monthlyTrends" :key="index" class="hover:bg-gray-50">
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{ month.label }}</td>
                  <td v-for="(label, reason) in reasonLabels" :key="reason" class="px-3 py-2 whitespace-nowrap text-sm text-center">
                    <Badge
                        v-if="month.counts[reason] > 0"
                        :style="{ backgroundColor: getReasonColor(reason) }"
                        class="bg-opacity-90"
                    >
                      {{ month.counts[reason] }}
                    </Badge>
                    <span v-else class="text-gray-400">0</span>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-center font-medium">
                    {{ month.total }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sheet para mostrar detalles de ausentes -->
    <Sheet v-model:open="sheetOpen">
      <SheetContent class="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Detalles de Inasistencias</SheetTitle>
          <SheetDescription v-if="selectedNucleo">
            {{ selectedComite }} - {{ selectedNucleo.name }}
            <Badge class="ml-2" :style="{ backgroundColor: getReasonColor(getShortReasonKey(selectedReason)) }">
              {{ selectedReason }}
            </Badge>
          </SheetDescription>
        </SheetHeader>

        <div class="py-6" v-if="selectedNucleo">
          <!-- Resumen de inasistencias -->
          <div class="mb-4 p-3 bg-gray-50 rounded-md">
            <h4 class="text-sm font-medium mb-2">Resumen</h4>
            <div class="flex items-center justify-between">
              <span class="text-sm">Total de inasistencias:</span>
              <Badge>{{ selectedNucleo.militantes.length }}</Badge>
            </div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-sm">Secretario General:</span>
              <span class="text-sm font-medium">{{ selectedNucleo.secretarioGeneral }}</span>
            </div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-sm">Secretario Funcionamiento:</span>
              <span class="text-sm font-medium">{{ selectedNucleo.secretarioFuncionamiento }}</span>
            </div>
          </div>

          <!-- Detalles por razón -->
          <div class="space-y-3">
            <h4 class="text-sm font-medium">Militantes ausentes</h4>

            <div class="p-3 border border-gray-200 rounded-md">
              <!-- Lista de ausentes -->
              <div class="space-y-2">
                <div v-for="militante in selectedNucleo.militantes" :key="militante.id" class="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div class="flex items-center">
                    <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
                      {{ getInitials(militante.firstname, militante.lastname) }}
                    </div>
                    <div>
                      <span class="text-sm font-medium">{{ militante.firstname }} {{ militante.lastname }}</span>
                      <div class="text-xs text-gray-500">{{ militante.organization }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-gray-500">{{ militante.email }}</div>
                    <div class="text-xs text-gray-500">{{ militante.phone }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button @click="sheetOpen = false">Cerrar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, FolderIcon } from "lucide-vue-next";
import MilitantService from "@/services/MilitantService.ts";
import { defineProps } from 'vue';

// Interfaces para los datos
interface Militante {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  organization: string;
  estado: boolean;
  address: string;
  phone: string;
}

interface Core {
  id: number;
  name: string;
  secretarioGeneral: string;
  secretarioFuncionamiento: string;
  comite: {
    id: number;
    name: string;
  };
  militantes: Militante[];
}

interface ComiteData {
  id: number;
  name: string;
  total: number;
  porcent: number;
  cores: Core[];
}

interface AttendanceData {
  withMilitante: {
    reasons: {
      [reason: string]: ComiteData[];
    };
  };
  withCommittes: {
    [comite: string]: {
      [nucleo: string]: {
        [reason: string]: number;
        total: number;
      };
    };
  };
}

const props = defineProps<{
  selectedMonth: string;
}>();

const selectedDashboard = ref("inasistencias-por-razon");
const selectedMonth = ref(props.selectedMonth);

// Define attendanceData as a reactive property
const attendanceData = ref<AttendanceData>({
  withMilitante: { reasons: {} },
  withCommittes: {}
});

// Estado para el Sheet
const sheetOpen = ref(false);
const selectedNucleo = ref<Core | null>(null);
const selectedReason = ref<string | null>(null);
const selectedComite = ref<string | null>(null);

// Etiquetas completas para las razones
const reasonLabels = {
  ENF: "Enfermedad",
  EXT: "Extranjero",
  TRAB: "Trabajo",
  FP: "Fuera de Provincia",
  Vac: "Vacaciones",
  LM: "Lic. de Maternidad",
  PP: "Problemas Personales",
  PF: "Problemas Familiares",
  Mov: "Movilizado",
  Inj: "Injustificado",
  Otr: "Otros",
};

// Mapeo inverso de nombres completos a claves cortas
const reasonKeysMap = {
  "Enfermedad": "ENF",
  "Extranjero": "EXT",
  "Trabajo": "TRAB",
  "Fuera de Provincia": "FP",
  "Vacaciones": "Vac",
  "Lic. de Maternidad": "LM",
  "Problemas Personales": "PP",
  "Problemas Familiares": "PF",
  "Movilizado": "Mov",
  "Injustificado": "Inj",
  "Otros": "Otr"
};

// Obtener la clave corta para una razón
const getShortReasonKey = (reason: string): string => {
  return reasonKeysMap[reason] || reason;
};

// Versiones cortas de las razones para el gráfico
const getShortReason = (reason: string) => {
  const shortForms: Record<string, string> = {
    ENF: "ENF",
    EXT: "EXT",
    TRAB: "TRAB",
    FP: "F.P.",
    Vac: "VAC",
    LM: "L.M.",
    PP: "P.P.",
    PF: "P.F.",
    Mov: "MOV",
    Inj: "INJ",
    Otr: "OTR",
  };
  return shortForms[reason] || reason;
};

// Colores para las diferentes razones
const getReasonColor = (reason: string) => {
  const colors: Record<string, string> = {
    ENF: "#ef4444", // Rojo
    EXT: "#3b82f6", // Azul
    TRAB: "#eab308", // Amarillo
    FP: "#22c55e", // Verde
    Vac: "#a855f7", // Púrpura
    LM: "#ec4899", // Rosa
    PP: "#f97316", // Naranja
    PF: "#14b8a6", // Teal
    Mov: "#6366f1", // Índigo
    Inj: "#f43f5e", // Rosa fuerte
    Otr: "#6b7280", // Gris
  };
  return colors[reason] || "#6b7280";
};

// Calcular el total de inasistencias por razón
const getTotalPorRazon = (reason: string): number => {
  if (!attendanceData.value.withMilitante?.reasons[reason]) return 0;

  return attendanceData.value.withMilitante.reasons[reason].reduce((total, comite) => {
    return total + comite.total;
  }, 0);
};

// Calcular el total de ausencias por comité
const getTotalAusenciasPorComite = (comite: string): number => {
  if (!attendanceData.value.withCommittes || !attendanceData.value.withCommittes[comite]) return 0;

  let total = 0;
  const nucleos = attendanceData.value.withCommittes[comite];

  Object.values(nucleos).forEach(nucleoData => {
    total += nucleoData.total || 0;
  });

  return total;
};

// Calcular el total general de inasistencias
const getTotalGeneral = (): number => {
  if (!attendanceData.value.withCommittes) return 0;

  let total = 0;

  Object.keys(attendanceData.value.withCommittes).forEach(comite => {
    total += getTotalAusenciasPorComite(comite);
  });

  return total;
};

// Calcular porcentaje por razón
const getPercentByReason = (reason: string): number => {
  const total = getTotalGeneral();
  if (total === 0) return 0;

  return Math.round((getTotalPorRazon(reason) / total) * 100);
};

// Calcular porcentaje por comité
const getPercentByComite = (comite: string): number => {
  const total = getTotalGeneral();
  if (total === 0) return 0;

  return Math.round((getTotalAusenciasPorComite(comite) / total) * 100);
};

// Obtener iniciales de un nombre
const getInitials = (firstname: string, lastname: string): string => {
  const first = firstname.charAt(0);
  const last = lastname.charAt(0);
  return `${first}${last}`.toUpperCase();
};

// Formatear mes seleccionado
const formatMonth = (monthString: string): string => {
  if (!monthString) return '';

  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);

  return new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' }).format(date);
};

// Mostrar detalles de un núcleo para una razón específica
const showNucleoDetails = (core: Core, reason: string, comiteName: string) => {
  selectedNucleo.value = core;
  selectedReason.value = reason;
  selectedComite.value = comiteName;
  sheetOpen.value = true;
};

// Mostrar detalles de un núcleo para todas las razones
const showNucleoAllDetails = (comite: string, nucleo: string) => {
  // Buscar el núcleo en los datos de withMilitante
  if (!attendanceData.value.withMilitante) return;

  for (const [reason, comites] of Object.entries(attendanceData.value.withMilitante.reasons)) {
    for (const comiteData of comites) {
      if (comiteData.name === comite) {
        for (const core of comiteData.cores) {
          if (core.name === nucleo) {
            showNucleoDetails(core, reason, comite);
            return;
          }
        }
      }
    }
  }
};

// Datos simulados para tendencias mensuales
const monthlyTrends = computed(() => {
  // Generar datos de tendencias para los últimos 6 meses
  const months = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);

    // Generar datos aleatorios para cada razón
    const counts = {};
    let total = 0;

    Object.keys(reasonLabels).forEach(reason => {
      // Valor aleatorio entre 0 y 10
      const value = Math.floor(Math.random() * 11);
      counts[reason] = value;
      total += value;
    });

    // Calcular porcentajes para el gráfico
    const data = {};
    Object.keys(reasonLabels).forEach(reason => {
      data[reason] = total > 0 ? (counts[reason] / total) * 100 : 0;
    });

    months.push({
      label: new Intl.DateTimeFormat('es', { month: 'short', year: 'numeric' }).format(date),
      counts,
      total,
      data
    });
  }

  return months;
});

async function getAbsentCause() {
  const value = selectedMonth.value;
  const [year, month] = value.split("-");
  const service = new MilitantService();
  try {
    attendanceData.value = await service.getAbsentCausesWithMilitante(parseInt(month), parseInt(year));
  } catch (e) {
    console.error("Error fetching data:", e);
  }
}

onMounted(() => {
  getAbsentCause();
});
</script>

<style scoped>
/* Animaciones para expandir/colapsar secciones */
.collapsible-content-enter-active,
.collapsible-content-leave-active {
  transition: all 0.3s ease-out;
}

.collapsible-content-enter-from,
.collapsible-content-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Transiciones entre dashboards */
.dashboard-enter-active,
.dashboard-leave-active {
  transition: opacity 0.3s ease;
}

.dashboard-enter-from,
.dashboard-leave-to {
  opacity: 0;
}
</style>