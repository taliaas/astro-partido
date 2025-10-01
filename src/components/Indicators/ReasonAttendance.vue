<template>
  <div>
    <!-- Selector de Dashboard -->
    <div class="mb-6">
      <div class="bg-white rounded-lg p-4">
        <div class="flex gap-4">
          <div>
            <h2 class="text-lg font-medium text-gray-900">
              Análisis de Inasistencias
            </h2>
            <p class="text-sm text-gray-500">
              Visualización y gestión de ausencias por comités y núcleos
            </p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <!-- Resumen general -->
      <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 class="text-lg font-medium mb-4">
          Resumen General de Inasistencias
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Gráfico de barras por causa -->
          <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 class="text-lg font-medium mb-2">Por causa</h4>
            <div class="space-y-2">
              <div
                v-for="(reason, index) of reasonLabels"
                :key="index"
                class="flex items-center gap-4"
              >
                <span class="text-md w-1/4">{{ reason }}</span>
                <div
                  class="flex-1 h-3 p-2 w-2/4 bg-gray-100 rounded-full overflow-hidden"
                ></div>
              </div>
            </div>
          </div>

          <!-- Tabla resumen por comité -->
          <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 class="text-lg font-medium mb-2">Por comité</h4>
            <div class="space-y-2">
              <div
                v-for="(item, index) in comite"
                :key="item.id"
                class="flex items-center justify-between border-b border-gray-100 pb-1"
              >
                <span class="text-md">{{ item.name }}</span>
                <div class="flex items-center">
                  <span class="text-sm font-medium">{{ index }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between pt-1 font-medium">
                <span>Total general</span>
                <span></span>
              </div>
            </div>
          </div>

          <!-- Tabla de distribución por núcleo -->
          <div
            class="bg-gray-50 p-4 rounded-md border border-gray-200 md:col-span-2"
          >
            <h4 class="text-sm font-medium mb-2">Distribución por núcleo</h4>
            <div class="overflow-x-auto">
              <table class="w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Comité
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Núcleo
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody class="border">
                  <tr v-for="(comi, index) of comite" :key="index">
                    <td class="px-3 py-2 text-left text-md font-medium">
                      {{ comi.name }}
                    </td>

                    <td>
                      <span
                        v-for="nucleo of comi.core"
                        :key="nucleo.id"
                        class="px-3 py-2 text-xs font-medium block"
                        >{{ nucleo.name }}</span
                      >
                    </td>
                    <td>
                      <span
                        v-for="nucleo of comi.core"
                        :key="nucleo.id"
                        class="px-3 py-2 text-xs font-medium block"
                        >0</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Leyenda -->
        <div
          class="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 md:grid-cols-6 gap-2"
        >
          <div
            v-for="(label, key) in reasonLabels"
            :key="key"
            class="flex items-center"
          >
            <div
              class="w-3 h-3 rounded-full mr-2"
              :style="{ backgroundColor: getReasonColor(key) }"
            ></div>
            <span class="text-xs">{{ label }}</span>
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
            <Badge
              class="ml-2"
              :style="{
                backgroundColor: getReasonColor(
                  getShortReasonKey(selectedReason)
                ),
              }"
            >
              {{ selectedReason }}
            </Badge>
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button @click="sheetOpen = false">Cerrar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { defineProps, ref } from "vue";

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
  cores: Core[];
}

const { comite, selectedMonth } = defineProps<{
  selectedMonth: string;
  comite: any[];
}>();

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
  Enfermedad: "ENF",
  Extranjero: "EXT",
  Trabajo: "TRAB",
  "Fuera de Provincia": "FP",
  Vacaciones: "Vac",
  "Lic. de Maternidad": "LM",
  "Problemas Personales": "PP",
  "Problemas Familiares": "PF",
  Movilizado: "Mov",
  Injustificado: "Inj",
  Otros: "Otr",
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
