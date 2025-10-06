<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-[1600px] mx-auto space-y-6">
      <!-- Header and Selector -->
      <div class="p-6">
        <div class="flex justify-between p-2">
          <h1 class="text-2xl font-bold mb-6">Análisis por Indicador</h1>
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
                    v-for="[key, indicator] of getIndicatorsByCategory(
                      category
                    )"
                    :key="key"
                    @click="selectedIndicator = key"
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

      <!-- Selected Indicator Analysis -->
      <div v-else class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-end">
          <button
            @click="selectedIndicator = ''"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>
        <div class="flex items-center justify-between mb-6">
          <div class="w-full pt-6">
            <Select
              :default-value="selectedIndicator"
              v-model="selectedIndicator"
            >
              <SelectTrigger>
                <SelectValue
                  class="text-xl font-semibold focus:ring-offset-blue-50"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="[key, indicator] of Object.entries(indicators)"
                    :value="key"
                    >{{ indicator.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div v-if="selectedIndicator === 'asistencia'">
          <Asistencia :comite :computo />
        </div>
        <div v-else-if="selectedIndicator === 'reason'">
          <ReasonAttendance :comite :selectedMonth="selectedMonth" />
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="com in comite"
            class="overflow-hidden space-y-2 divide-y"
            :key="com"
          >
            <Collapsible default-open>
              <CollapsibleTrigger
                class="flex justify-between items-center group w-full p-2 text-lg font-medium hover:bg-gray-200 bg-gray-100 border border-gray-300 rounded-md group transition-colors"
              >
                {{ com.name }}

                <div class="flex items-center gap-2">
                  <div
                    class="group-data-[state=closed]:hidden px-3 bg-green-100 rounded-full"
                  >
                    <span class="text-green-700 text-sm"
                      >Total: {{ setTotal(com) }}
                    </span>
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
                    <p class="text-gray-600">{{ getComputo(nucleo)?.value }}</p>
                    <div
                      v-if="
                        getComputo(nucleo)?.value &&
                        getComputo(nucleo)!.value > 2
                      "
                      class="p-1 bg-green-100 rounded-full"
                    >
                      <ArrowUpIcon class="h-4 w-4 text-green-600" />
                    </div>
                    <div
                      v-else-if="getComputo(nucleo)?.value === 0"
                      class="flex items-center justify-center p-2 rounded-full bg-gray-100"
                    >
                      <Separator class="h-0.5 w-3 bg-gray-400" />
                    </div>
                    <div
                      v-else-if="
                        getComputo(nucleo)?.value &&
                        getComputo(nucleo)!.value < 2
                      "
                      class="bg-red-100 rounded-full p-1"
                    >
                      <ArrowDownIcon class="h-4 w-4 text-red-600" />
                    </div>
                    <Sheet>
                      <SheetTrigger>
                        <EyeIcon class="h-4 w-4 text-gray-500" />
                      </SheetTrigger>
                      <SheetContent class="space-y-4">
                        <SheetHeader class="space-y-2">
                          <SheetTitle class="text-2xl">Detalles</SheetTitle>
                          <div class="py-2">
                            <h2 class="font-medium text-lg">
                              {{ nucleo?.name }}
                            </h2>
                            <div class="flex">
                              <p class="font-medium text-xl mr-2">
                                {{ getComputo(nucleo)?.value }}
                              </p>
                              <div
                                v-if="
                                  getComputo(nucleo)?.value &&
                                  getComputo(nucleo)!.value > 2
                                "
                                class="flex items-center justify-center space-x-1"
                              >
                                <ArrowUpIcon class="h-4 w-4 text-green-600" />
                                <p class="text-green-600">Incremento</p>
                              </div>
                              <div
                                v-else-if="getComputo(nucleo)?.value === 0"
                                class="flex items-center justify-center space-x-1"
                              >
                                <Separator class="h-0.5 w-3 bg-gray-400" />
                                <p class="text-gray-600">Sin cambios</p>
                              </div>
                              <div
                                v-else-if="
                                  getComputo(nucleo)?.value &&
                                  getComputo(nucleo)!.value < 2
                                "
                                class="flex items-center justify-center space-x-1"
                              >
                                <ArrowDownIcon class="h-4 w-4 text-red-600" />
                                <p class="text-red-600">Disminución</p>
                              </div>
                            </div>
                          </div>

                          <SheetDescription
                            class="bg-gray-100 rounded-md p-2 text-md"
                          >
                            <h2 class="font-medium text-lg text-foreground">
                              Descripción
                            </h2>
                            <p class="text-gray-600">
                              {{ getComputo(nucleo)?.text }}
                            </p>
                          </SheetDescription>
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
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
import Asistencia, {
  type ComputoData,
} from "@/components/Indicators/Asistencia.vue";
import ReasonAttendance from "@/components/Indicators/ReasonAttendance.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { categories, indicators } from "@/utils/indicators.ts";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  EyeIcon,
  Search,
  XIcon,
} from "lucide-vue-next";
import { ref } from "vue";

const selectedIndicator = ref("");
const selectedMonth = ref("2025-01");
const { comite, computo } = defineProps<{
  comite: any[];
  computo: ComputoData[];
}>();

const search = ref("");

// Función para obtener indicadores por categoría
const getIndicatorsByCategory = (category: string) => {
  return Object.entries(indicators).filter(
    ([key, indicator]) => indicator.category === category
  );
};

const getComputo = (nucleo: { id: string }) => {
  const value = selectedMonth.value;
  const [year, month] = value.split("-");
  const indicator = selectedIndicator.value;

  const c = computo.find(
    (c) =>
      c.month == Number(month) &&
      c.year == Number(year) &&
      c.core?.id === nucleo.id
  );

  return c?.indicators?.find((i) => i.key === indicator) ?? undefined;
};

const setTotal = (comite: { core: { id: string }[] }) => {
  let total = 0;

  for (const nucleo of comite.core) {
    total += getComputo(nucleo)?.value ?? 0;
  }

  return total;
};
</script>
