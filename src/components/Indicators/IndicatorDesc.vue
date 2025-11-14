<script setup lang="ts">
import Asistencia from "@/components/Indicators/Asistencia.vue";
import ReasonAttendance from "@/components/Indicators/ReasonAttendance.vue";
import Button from "@/components/ui/button/Button.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Input from "@/components/ui/input/Input.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Separator from "@/components/ui/separator/Separator.vue";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { indicators } from "@/utils/indicators";
import { useUrlSearchParams } from "@vueuse/core";
import { navigate } from "astro:transitions/client";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  EyeIcon,
  SeparatorHorizontal,
  SeparatorHorizontalIcon,
  XIcon,
} from "lucide-vue-next";

const { indicator, comite, computos } = defineProps<{
  indicator: string;
  computos: any[];
  comite: any;
}>();

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

const indicador = (coreId: string) => {
  const computo = computos.find(
    (computo) => computo?.minute?.core?.id === coreId
  );
  return computo?.indicators?.find((ind) => ind?.key === indicator).value;
};
</script>

<template>
  <div class="mx-auto p-6">
    <!-- Selected Indicator Analysis -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-end">
        <Button
          variant="ghost"
          @click=""
          class="text-gray-500 hover:text-gray-700"
        >
          <a href="/analisis_indicador/comite"><XIcon class="h-5 w-5" /></a>
        </Button>
      </div>
      <div class="flex items-center justify-between mb-6">
        <div class="w-full">
          <Select
            :default-value="indicator"
            @update:model-value="
              navigate(`/analisis_indicador/comite/${$event}`)
            "
          >
            <SelectTrigger>
              <SelectValue />
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
        <!-- Date -->
        <Input
          type="month"
          class="basis-1/10"
          :model-value="searchParams.date as string"
          @update:model-value="handleModelFilter('date', $event as string)"
        />
      </div>
      <div v-if="indicator === 'asistencia'">
        <Asistencia :comite :computos />
      </div>
      <div v-else-if="indicator === 'reason'">
        <ReasonAttendance />
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="com in comite"
          class="overflow-hidden space-y-2 divide-y"
          :key="com"
        >
          <Collapsible default-open>
            <CollapsibleTrigger
              class="flex justify-between rounded p-2 border w-full font-medium"
            >
              {{ com.name }}
              <ChevronDownIcon
                class="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div
                v-if="com?.cores?.length === 0"
                class="flex justify-between px-4 text-muted-foreground italic"
              >
                <p class="py-2">No hay núcleos en este cómite</p>
              </div>
              <div
                v-else
                v-for="core in com?.cores"
                :key="core.name"
                class="flex justify-between border rounded hover:bg-gray-50 p-2"
              >
                <div class="flex gap-2">
                  <div class="rounded-full mt-2 w-2 h-2 bg-primary"></div>
                  <p class="text-foreground">{{ core.name }}</p>
                </div>
                <div class="flex space-x-2">
                  <p class="text-gray-600">
                    {{ indicador(core?.id) }}
                  </p>
                  <div
                    class="bg-green-100 rounded-full p-1"
                    v-if="indicador(core.id) > 2"
                  >
                    <ArrowUpIcon class="h-4 w-4 text-green-600" />
                  </div>
                  <div
                    v-else-if="indicador(core?.id) < 3"
                    class="bg-red-100 rounded-full p-1"
                  >
                    <ArrowDownIcon class="h-4 w-4 text-red-600" />
                  </div>
                  <div
                    v-else
                    class="rounded-full p-1 bg-gray-100 px-2 font-bold text-gray-500"
                  >
                    -
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
                            {{ core?.name }}
                          </h2>
                          <div class="flex">
                            <p class="font-medium text-xl mr-2"></p>
                            <div
                              class="flex items-center justify-center space-x-1"
                            >
                              <ArrowUpIcon class="h-4 w-4 text-green-600" />
                              <p class="text-green-600">Incremento</p>
                            </div>
                            <div>
                              <Separator class="h-0.5 w-3 bg-gray-400" />
                              <p class="text-gray-600">Sin cambios</p>
                            </div>
                            <div
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
                          <p class="text-gray-600"></p>
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
</template>
