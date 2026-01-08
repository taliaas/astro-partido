<script setup lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Separator from "@/components/ui/separator/Separator.vue";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Computo } from "@/interface/Indicadores";
import type { Comite } from "@/interface/Militante";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  EyeIcon,
} from "lucide-vue-next";

const { comite, computos } = defineProps<{
  computos: Computo[];
  comite: Comite[];
}>();

function getIndicator(id: string) {
  return (
    computos.find((ind) => ind.minute.core?.id === id)?.indicators[0].value || 0
  );
}
</script>

<template>
  <div
    v-for="com in comite"
    class="overflow-hidden space-y-2 divide-y"
    :key="com.id"
  >
    <Collapsible>
      <CollapsibleTrigger
        class="flex justify-between items-center group w-full p-2 text-lg font-medium hover:bg-gray-100 bg-gray-50 border border-gray-300 rounded-md group transition-colors"
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
            <p class="text-foreground">{{ core.name }}</p>
          </div>
          <div class="flex space-x-2">
            <p v-if="getIndicator(core.id) !== 0" class="text-gray-600">
              {{ getIndicator(core?.id) }}
            </p>
            <div
              class="bg-green-100 rounded-full p-1"
              v-if="getIndicator(core.id) > 2"
            >
              <ArrowUpIcon class="h-4 w-4 text-green-600" />
            </div>
            <div
              v-else-if="
                getIndicator(core?.id) < 3 && getIndicator(core.id) > 0
              "
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
                        v-if="getIndicator(core.id) > 2"
                        class="flex items-center justify-center space-x-1"
                      >
                        <ArrowUpIcon class="h-4 w-4 text-green-600" />
                        <p class="text-green-600">Incremento</p>
                      </div>
                      <div
                        v-if="
                          getIndicator(core.id) < 3 && getIndicator(core.id) > 0
                        "
                        class="flex items-center justify-center space-x-1"
                      >
                        <ArrowDownIcon class="h-4 w-4 text-red-600" />
                        <p class="text-red-600">Disminución</p>
                      </div>
                      <div v-else>
                        <Separator class="h-0.5 w-3 bg-gray-400" />
                        <p class="text-gray-600">Sin cambios</p>
                      </div>
                    </div>
                  </div>

                  <SheetDescription class="bg-gray-100 rounded-md p-2 text-md">
                    <h2 class="font-medium text-lg text-foreground">
                      Descripción
                    </h2>
                    <p v-if="getIndicator(core.id) === 0" class="text-gray-600">
                      No hay valores para este indicador
                    </p>
                    <p v-else>{{ getIndicator(core.id) }}</p>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
