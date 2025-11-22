<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-[1600px] mx-auto space-y-6">
      <!-- Header and Selector -->
      <div class="p-6">
        <div class="flex justify-between p-2">
          <h1 class="text-2xl font-bold mb-6">Análisis por Indicador</h1>
        </div>
        {{ computos }}
        <div class="flex gap-4">
          <div class="relative flex-1">
            <Search
              class="left-3 top-1/2 -translate-y-1/2 size-3 text-gray-400 absolute"
            />
            <Input
              id="search"
              :value="searchParams.name ?? ''"
              placeholder="Buscar..."
              class="p-2 pl-10 rounded-md bg-white shadow-sm"
            />
          </div>
          <!-- Date -->
          <Input
            type="month"
            class="basis-1/8"
            :model-value="searchParams.date as string"
            @update:model-value="handleModelFilter('date', $event as string)"
          />
          <Exports :computos :month />
        </div>
      </div>
      <!-- Indicators List with Collapsible Sections -->

      <div
        v-for="category of categories"
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
                  v-for="[key, indicator] of getIndicatorsByCategory(category)"
                  :key="key"
                  @click="handleCategory(key)"
                  class="p-4 bg-white shadow-sm border rounded-lg cursor-pointer hover:shadow-md transition-colors"
                >
                  <div class="flex space-x-2">
                    <h3 class="font-medium text-xl">
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
  </div>
</template>

<script setup lang="ts">
import Exports from "@/components/Indicators/export/Exports.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { categories, indicators } from "@/utils/indicators.ts";
import { useUrlSearchParams } from "@vueuse/core";
import { navigate } from "astro:transitions/client";
import { ChevronDownIcon, Search } from "lucide-vue-next";
import { computed } from "vue";

const selectedIndicator = computed(() => searchParams.indicator);
const { computos, month } = defineProps<{ computos: any; month: string }>();

const searchParams = useUrlSearchParams("history", {
  removeFalsyValues: true,
  initialValue: {
    date: getDefaultFilterDate(),
    indicator: "",
    name: "",
  },
});

function getDefaultFilterDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const handleModelFilter = (filter: string, value: string) => {
  const query = new URLSearchParams(searchParams as any);
  if (value && value !== "all") {
    query.set(filter, value);
  } else {
    query.delete(filter);
  }
  navigate("?" + query.toString());
};

// Función para obtener indicadores por categoría
const getIndicatorsByCategory = (category: string) => {
  return Object.entries(indicators).filter(
    ([key, indicator]) => indicator.category === category
  );
};

const handleCategory = (category: string) => {
  const query = new URLSearchParams(searchParams as any);
  navigate(`/analisis_indicador/comite/${category}?${query.toString()}`);
};
</script>
