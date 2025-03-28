<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-[1600px] mx-auto space-y-6">
      <!-- Header and Selector -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between p-2">
          <h1 class="text-2xl font-bold mb-6">Análisis por Indicador</h1>
          <a href="/parte" class="px-2 p-2 rounded text-lg font-semibold flex">
            Parte Municipio</a>
        </div>

        <div class="flex gap-4">
          <div class="relative w-full">
            <Search class="left-3 top-1/2 -translate-y-1/2 size-3 text-gray-400 absolute" />
            <input v-model="search" placeholder="Buscar..."
              class="w-full p-2 border text-lg pl-10 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <input type="month" v-model="selectedMonth"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <!-- Indicators List with Collapsible Sections -->
      <div v-for="category in Object.keys(categories)" class="bg-white border border-gray-200 rounded-lg shadow-sm"
        v-if="!selectedIndicator" :key="category">
        <div class="p-4">
          <Collapsible>
            <CollapsibleTrigger class="flex items-center w-full justify-between text-lg font-medium">
              {{ category }}
              <ChevronDownIcon class="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                <div v-for="indicator in getIndicatorsByCategory(category)" :key="indicator.key"
                  @click="selectIndicator(indicator.key)"
                  class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div class="flex space-x-2">
                    <Checkbox v-model="checked_indicator" class="mt-2"></Checkbox>
                    <h3 class="font-medium text-xl">{{ indicator.name }}</h3>
                  </div>
                  <p class="text-gray-500 text-md">
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
import { categories, indicators } from "@/components/Indicators/indicators";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import OrdinaryService from "@/services/OrdinaryService.ts";
import { ChevronDownIcon, Search } from "lucide-vue-next";
import { computed, ref, watch } from "vue";

const selectedIndicator = ref("");
const selectedMonth = ref("2025-01");
const { comite, computo } = defineProps<{
  comite: any[];
  computo: any;
}>();

const selected = false;
const search = ref("");
const checked_indicator = ref("");

// Función para obtener indicadores por categoría
const getIndicatorsByCategory = (category: string) => {
  type CategoryName = (keyof typeof categories)
  return indicators
    .filter((indicator) => categories[category as CategoryName].includes(indicator.key))
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
