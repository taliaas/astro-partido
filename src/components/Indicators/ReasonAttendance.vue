<template>
  <div>
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
                      class="flex justify-between items-center p-3 hover:bg-gray-50 transition-colors"
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

    <!-- Resumen general -->
    <div class="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 class="text-lg font-medium mb-4">Resumen General de Inasistencias</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Gráfico de barras por causa -->
        <div class="bg-white p-4 rounded-md border border-gray-200">
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
        <div class="bg-white p-4 rounded-md border border-gray-200">
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
        <div class="bg-white p-4 rounded-md border border-gray-200 md:col-span-2">
          <h4 class="text-sm font-medium mb-2">Distribución por núcleo</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comité</th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Núcleo</th>
                <th scope="col" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Distribución</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="comite in comites" :key="comite.id">
                <tr v-for="(nucleo, index) in comite.nucleos" :key="nucleo.id" class="hover:bg-gray-50">
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
</template>

<script setup lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDownIcon } from "lucide-vue-next";
import { ref } from "vue";

// Datos de ejemplo (simula los datos que vendrían de una API)
const comites = ref([
  {
    id: 1,
    name: "Independientes",
    nucleos: [
      {
        id: 1,
        name: "CEIS",
        inasistencias: {
          ENF: 2,
          EXT: 1,
          TRAB: 0,
          FP: 0,
          Vac: 1,
          LM: 0,
          PP: 2,
          PF: 1,
          Mov: 0,
          Inj: 0,
          Otr: 0,
        }
      },
      {
        id: 2,
        name: "Arquitectura",
        inasistencias: {
          ENF: 1,
          EXT: 0,
          TRAB: 3,
          FP: 1,
          Vac: 0,
          LM: 0,
          PP: 0,
          PF: 0,
          Mov: 0,
          Inj: 2,
          Otr: 1,
        }
      },
      {
        id: 3,
        name: "CIPEL",
        inasistencias: {
          ENF: 3,
          EXT: 0,
          TRAB: 1,
          FP: 0,
          Vac: 2,
          LM: 1,
          PP: 0,
          PF: 1,
          Mov: 0,
          Inj: 0,
          Otr: 0,
        }
      },
      {
        id: 4,
        name: "VREAS",
        inasistencias: {
          ENF: 0,
          EXT: 2,
          TRAB: 0,
          FP: 1,
          Vac: 0,
          LM: 0,
          PP: 0,
          PF: 0,
          Mov: 1,
          Inj: 0,
          Otr: 0,
        }
      }
    ]
  },
  {
    id: 2,
    name: "Mixtos",
    nucleos: [
      {
        id: 5,
        name: "Proyecto A",
        inasistencias: {
          ENF: 1,
          EXT: 0,
          TRAB: 2,
          FP: 0,
          Vac: 0,
          LM: 0,
          PP: 1,
          PF: 0,
          Mov: 0,
          Inj: 1,
          Otr: 0,
        }
      },
      {
        id: 6,
        name: "Proyecto B",
        inasistencias: {
          ENF: 0,
          EXT: 1,
          TRAB: 0,
          FP: 0,
          Vac: 2,
          LM: 0,
          PP: 0,
          PF: 1,
          Mov: 0,
          Inj: 0,
          Otr: 1,
        }
      }
    ]
  },
  {
    id: 3,
    name: "Química",
    nucleos: [
      {
        id: 7,
        name: "Laboratorio A",
        inasistencias: {
          ENF: 2,
          EXT: 0,
          TRAB: 1,
          FP: 0,
          Vac: 0,
          LM: 0,
          PP: 0,
          PF: 2,
          Mov: 0,
          Inj: 1,
          Otr: 0,
        }
      },
      {
        id: 8,
        name: "Proyecto Síntesis",
        inasistencias: {
          ENF: 1,
          EXT: 0,
          TRAB: 0,
          FP: 1,
          Vac: 0,
          LM: 1,
          PP: 0,
          PF: 0,
          Mov: 1,
          Inj: 0,
          Otr: 0,
        }
      }
    ]
  }
]);

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
</script>