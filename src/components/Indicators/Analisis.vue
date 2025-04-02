<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-[1600px] mx-auto space-y-6">
      <!-- Header and Selector -->
      <div class="p-6">
        <div class="flex justify-between p-2">
          <h1 class="text-2xl font-bold mb-6">Análisis por Indicador</h1>
          <TooltipProvider>
            <Tooltip class="hover:bg-muted dark:hover:bg-gray-700 rounded-full">
              <TooltipTrigger>
                <a
                  href="/parte"
                  class="px-2 p-2 rounded text-lg font-semibold flex"
                >
                  Parte Municipio</a
                >
              </TooltipTrigger>
              <TooltipContent>
                <p>Resumen Parte Municipio PCC</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
      <div class="space-y-2" v-if="!selectedIndicator">
        <div
          v-for="category in Object.keys(categories)"
          class="overflow-hidden"
          :key="category"
        >
          <div class="p-2">
            <Collapsible>
              <CollapsibleTrigger
                class="flex items-center group w-full justify-between bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-lg font-medium"
              >
                {{ category }}
                <ChevronDownIcon
                  class="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform"
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4"
                >
                  <div
                    v-for="indicator in getIndicatorsByCategory(category)"
                    :key="indicator.key"
                    @click="selectedIndicator = indicator.key"
                    class="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-colors"
                  >
                    <div class="flex space-x-2">
                      <Checkbox
                        v-model="checked_indicator"
                        class="mt-2"
                      ></Checkbox>
                      <h3 class="font-medium text-xl ml-4">
                        {{ indicator.name }}
                      </h3>
                    </div>
                    <p class="text-gray-500 text-md mt-2">
                      {{ indicator.description }}
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
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
            <p class="text-gray-500 text-lg">
              {{ getSelectedIndicator.description }}
            </p>
          </div>
          <button
            @click="selectedIndicator = ''"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>
        <div class="space-y-3">
          <div
              v-for="com in comite"
              class="overflow-hidden space-y-2 divide-y"
              :key="com"
          >
            <Collapsible>
              <CollapsibleTrigger
                  class="flex justify-between items-center group w-full p-2 text-lg font-medium hover:bg-gray-200 bg-gray-100 border border-gray-300 rounded-md group transition-colors"
              >
                {{ com.name }}
                <div class="flex items-center gap-2">
                  <div class="group-data-[state=closed]:hidden px-3 bg-green-100 rounded-full">
                    <span class="text-green-700 text-sm">Total: {{total}}</span>
                  </div>
                  <ChevronDownIcon
                      class="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform"
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div
                    v-if="com?.core?.length === 0"
                    class="flex justify-between px-4 text-muted-foreground italic"
                >
                  <p class="py-2">No hay núcleos en este cómite</p>
                </div>
                <div
                    v-else
                    v-for="nucleo in com?.core"
                    :key="nucleo.name"
                    class="flex justify-between px-4 space-y-2 py-2 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div class="flex gap-2">
                    <div class="rounded-full mt-2 w-2 h-2 bg-primary"></div>
                    <p class="text-foreground">{{ nucleo.name }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <p class="text-gray-600">{{ getComputo(nucleo) }}</p>
                    <div v-if="getComputo(nucleo) > 2 " class="p-1 bg-green-100 rounded-full" >
                      <ArrowUpIcon class="h-4 w-4 text-green-600" />
                    </div>
                    <div v-else-if="getComputo(nucleo) === 0" class="flex items-center justify-center p-2 rounded-full bg-gray-100">
                      <Separator class="h-0.5 w-3 bg-gray-400"/>
                    </div>
                    <div v-else-if="getComputo(nucleo) < 2" class="bg-red-100 rounded-full p-1">
                      <ArrowDownIcon  class="h-4 w-4 text-red-600 " />
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { categories, indicators } from "@/components/Indicators/indicators";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-vue-next";
import OrdinaryService from "@/services/OrdinaryService.ts";
import { ChevronDownIcon, Search, XIcon } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const selectedIndicator = ref("");
const selectedMonth = ref("2025-01");
const { comite, computo } = defineProps<{
  comite: any[];
  computo: any;
}>();

const attendance = ref([]);
const search = ref("");
const checked_indicator = ref("");

// Función para obtener indicadores por categoría
const getIndicatorsByCategory = (category: string) => {
  type CategoryName = keyof typeof categories;
  return indicators
    .filter((indicator) =>
      categories[category as CategoryName].includes(indicator.key),
    )
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
