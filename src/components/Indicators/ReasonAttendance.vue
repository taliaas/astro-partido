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

            <div class="flex items-center gap-2">
             filtros
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Dinámico -->
    <div v-if="selectedDashboard === 'inasistencias-por-razon'">
      <!-- Causas desplegables -->
      <div class="space-y-2">
        <div v-for="(label, reason) in reasonLabels" :key="reason">
          <Collapsible>
            <CollapsibleTrigger
                class="flex justify-between items-center group w-full p-2 text-lg font-medium hover:bg-gray-100 bg-gray-50 border border-gray-300 rounded-md group transition-colors"
                :style="{ borderLeftColor: getReasonColor(reason), borderLeftWidth: '4px' }"
            >
              <div class="flex items-center">
                {{ label }}
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
                <div v-for="comite in comites" :key="comite.id" class="bg-white">
                  <div class="p-3 bg-gray-50 font-medium text-sm flex justify-between">
                    <span>{{ comite.name }}</span>
                    <span>Total: {{ getTotalPorRazonYComite(comite.id, reason) }}</span>
                  </div>
                  <div class="divide-y divide-gray-100">
                    <div
                        v-for="nucleo in comite.nucleos"
                        :key="nucleo.id"
                        class="flex justify-between items-center p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        @click="showNucleoDetails(nucleo, reason)"
                    >
                      <span class="text-sm">{{ nucleo.name }}</span>
                      <Badge
                          :variant="nucleo.inasistencias[reason] > 0 ? 'default' : 'outline'"
                          :class="nucleo.inasistencias[reason] > 0 ? 'bg-opacity-90' : 'text-gray-400'"
                          :style="nucleo.inasistencias[reason] > 0 ? { backgroundColor: getReasonColor(reason) } : {}"
                      >
                        {{ nucleo.inasistencias[reason] }}
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
      <div class="space-y-4">
        <div v-for="comite in comites" :key="comite.id">
          <Collapsible>
            <CollapsibleTrigger
                class="flex justify-between items-center group w-full p-3 text-lg font-medium hover:bg-gray-100 bg-white border border-gray-200 rounded-md shadow-sm group transition-colors"
            >
              <div class="flex items-center">
                <FolderIcon class="h-5 w-5 mr-2 text-blue-600" />
                {{ comite.name }}
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline" class="bg-blue-50 text-blue-800">
                  {{ comite.nucleos.length }} núcleos
                </Badge>
                <Badge variant="outline" class="bg-gray-50 text-gray-800">
                  {{ getTotalAusenciasPorComite(comite.id) }} ausencias
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
                    <th v-for="(label, reason) in reasonLabels" :key="reason" scope="col" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ getShortReason(reason) }}
                    </th>
                    <th scope="col" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="nucleo in comite.nucleos" :key="nucleo.id" class="hover:bg-gray-50 cursor-pointer" @click="showNucleoAllDetails(nucleo)">
                    <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{ nucleo.name }}</td>
                    <td v-for="(label, reason) in reasonLabels" :key="reason" class="px-3 py-2 whitespace-nowrap text-sm text-center">
                      <Badge
                          v-if="nucleo.inasistencias[reason] > 0"
                          :style="{ backgroundColor: getReasonColor(reason) }"
                          class="bg-opacity-90"
                      >
                        {{ nucleo.inasistencias[reason] }}
                      </Badge>
                      <span v-else class="text-gray-400">0</span>
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-center font-medium">
                      {{ getTotalPorNucleo(nucleo) }}
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
      <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 class="text-lg font-medium mb-4">Resumen General de Inasistencias</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Gráfico de barras por causa -->
          <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 class="text-sm font-medium mb-2">Por causa</h4>
            <div class="space-y-2">
              <div v-for="(label, key) in reasonLabels" :key="key" class="flex items-center">
                <span class="text-xs w-16">{{ getShortReason(key) }}</span>
                <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                      class="h-full rounded-full transition-all duration-500"
                      :style="{
                      width: `${getPercentByReason(key)}%`,
                      backgroundColor: getReasonColor(key)
                    }"
                  ></div>
                </div>
                <span class="ml-2 text-xs font-medium">{{ getTotalPorRazon(key) }}</span>
              </div>
            </div>
          </div>

          <!-- Tabla resumen por comité -->
          <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 class="text-sm font-medium mb-2">Por comité</h4>
            <div class="space-y-2">
              <div v-for="comite in comites" :key="comite.id" class="flex items-center justify-between border-b border-gray-100 pb-1">
                <span class="text-sm">{{ comite.name }}</span>
                <div class="flex items-center">
                  <span class="text-sm font-medium">{{ getTotalAusenciasPorComite(comite.id) }}</span>
                  <span class="text-xs text-gray-500 ml-1">({{ getPercentByComite(comite.id) }}%)</span>
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
                <template v-for="comite in comites" :key="comite.id">
                  <tr v-for="(nucleo, index) in comite.nucleos" :key="nucleo.id" class="hover:bg-gray-50 cursor-pointer" @click="showNucleoAllDetails(nucleo)">
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500" v-if="index === 0" :rowspan="comite.nucleos.length">
                      {{ comite.name }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{ nucleo.name }}</td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-center font-medium">{{ getTotalPorNucleo(nucleo) }}</td>
                    <td class="px-3 py-2">
                      <div class="flex h-4 rounded-full overflow-hidden w-full">
                        <template v-for="(label, reason) in reasonLabels" :key="reason">
                          <div
                              v-if="nucleo.inasistencias[reason] > 0"
                              :style="{
                                width: `${(nucleo.inasistencias[reason] / getTotalPorNucleo(nucleo)) * 100}%`,
                                backgroundColor: getReasonColor(reason)
                              }"
                              class="h-full"
                              :title="`${label}: ${nucleo.inasistencias[reason]}`"
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
      <!-- Dashboard de tendencias mensuales (ejemplo) -->
      <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 class="text-lg font-medium mb-4">Tendencias Mensuales de Inasistencias</h3>
        <p class="text-gray-500 mb-6">Análisis de la evolución de inasistencias en los últimos 6 meses</p>

        <div class="h-64 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
          <p class="text-gray-400">Gráfico de tendencias mensuales (simulado)</p>
        </div>
      </div>
    </div>

    <!-- Sheet para mostrar detalles de ausentes -->
    <Sheet v-model:open="sheetOpen">
      <SheetContent class="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Detalles de Inasistencias</SheetTitle>
          <SheetDescription v-if="selectedNucleo">
            {{ selectedNucleo.name }} - {{ selectedComite ? selectedComite.name : '' }}
          </SheetDescription>
        </SheetHeader>

        <div class="py-6" v-if="selectedNucleo">
          <!-- Resumen de inasistencias -->
          <div class="mb-4 p-3 bg-gray-50 rounded-md">
            <h4 class="text-sm font-medium mb-2">Resumen</h4>
            <div class="flex items-center justify-between">
              <span class="text-sm">Total de inasistencias:</span>
              <Badge>{{ getTotalPorNucleo(selectedNucleo) }}</Badge>
            </div>
          </div>

          <!-- Detalles por razón -->
          <div class="space-y-3">
            <h4 class="text-sm font-medium">Desglose por razón</h4>

            <div v-if="selectedReason" class="p-3 border border-gray-200 rounded-md">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <div
                      class="w-3 h-3 rounded-full mr-2"
                      :style="{ backgroundColor: getReasonColor(selectedReason) }"
                  ></div>
                  <span class="font-medium">{{ reasonLabels[selectedReason] }}</span>
                </div>
                <Badge :style="{ backgroundColor: getReasonColor(selectedReason) }">
                  {{ selectedNucleo.inasistencias[selectedReason] }}
                </Badge>
              </div>

              <!-- Lista de ausentes (simulada) -->
              <div class="mt-3 space-y-2">
                <h5 class="text-xs font-medium text-gray-500">Personas ausentes:</h5>
                <div v-for="i in selectedNucleo.inasistencias[selectedReason]" :key="i" class="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div class="flex items-center">
                    <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
                      {{ getInitials(`Militante ${i}`) }}
                    </div>
                    <span class="text-sm">Militante {{ i }}</span>
                  </div>
                  <span class="text-xs text-gray-500">{{}}</span>
                </div>
              </div>
            </div>

            <div v-else>
              <!-- Todas las razones -->
              <div v-for="(label, reason) in reasonLabels" :key="reason" class="p-3 border border-gray-200 rounded-md" v-show="selectedNucleo.inasistencias[reason] > 0">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div
                        class="w-3 h-3 rounded-full mr-2"
                        :style="{ backgroundColor: getReasonColor(reason) }"
                    ></div>
                    <span class="font-medium">{{ label }}</span>
                  </div>
                  <Badge :style="{ backgroundColor: getReasonColor(reason) }">
                    {{ selectedNucleo.inasistencias[reason] }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { ChevronDownIcon, FolderIcon } from "lucide-vue-next";
import MilitantService from "@/services/MilitantService.ts";
import { defineProps } from 'vue';

defineProps<{
  selectedMonth: string;
}>();

const selectedDashboard = ref("inasistencias-por-razon");

// Estado para el Sheet
const sheetOpen = ref(false);
const selectedNucleo = ref(null);
const selectedReason = ref(null);
const selectedComite = ref(null);

async function getAbsentCause(){
  const value = selectedMonth.value;
  const [year, month] = value.split("-");
  const service = new MilitantService()
  try{
    return service.getAbsentCausesWithMilitante(month, year)
  }catch (e) {
    throw e;
  }
}

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

// Calcular el total de inasistencias por núcleo
const getTotalPorNucleo = (nucleo) => {
  return Object.values(nucleo.inasistencias).reduce((a, b) => a + b, 0);
};

// Calcular el total de inasistencias por razón y comité
const getTotalPorRazonYComite = (comiteId, razon) => {
  const comite = comites.value.find(c => c.id === comiteId);
  if (!comite) return 0;

  return comite.nucleos.reduce((total, nucleo) => {
    return total + nucleo.inasistencias[razon];
  }, 0);
};

// Calcular el total de ausencias por comité
const getTotalAusenciasPorComite = (comiteId) => {
  const comite = comites.value.find(c => c.id === comiteId);
  if (!comite) return 0;

  return comite.nucleos.reduce((total, nucleo) => {
    return total + getTotalPorNucleo(nucleo);
  }, 0);
};

// Calcular el total general de inasistencias
const getTotalGeneral = () => {
  return comites.value.reduce((total, comite) => {
    return total + getTotalAusenciasPorComite(comite.id);
  }, 0);
};

// Calcular el total por razón en general
const getTotalPorRazon = (razon) => {
  return comites.value.reduce((total, comite) => {
    return total + getTotalPorRazonYComite(comite.id, razon);
  }, 0);
};

// Calcular porcentaje por razón
const getPercentByReason = (reason) => {
  const total = getTotalGeneral();
  if (total === 0) return 0;

  return Math.round((getTotalPorRazon(reason) / total) * 100);
};

// Calcular porcentaje por comité
const getPercentByComite = (comiteId) => {
  const total = getTotalGeneral();
  if (total === 0) return 0;

  return Math.round((getTotalAusenciasPorComite(comiteId) / total) * 100);
};

// Obtener iniciales de un nombre
const getInitials = (name: string) => {
  return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
};

// Mostrar detalles de un núcleo para una razón específica
const showNucleoDetails = (nucleo, reason) => {
  selectedNucleo.value = nucleo;
  selectedReason.value = reason;
  selectedComite.value = comites.value.find(c =>
      c.nucleos.some(n => n.id === nucleo.id)
  );
  sheetOpen.value = true;
};

// Mostrar detalles de un núcleo para todas las razones
const showNucleoAllDetails = (nucleo) => {
  selectedNucleo.value = nucleo;
  selectedReason.value = null;
  selectedComite.value = comites.value.find(c =>
      c.nucleos.some(n => n.id === nucleo.id)
  );
  sheetOpen.value = true;
};
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