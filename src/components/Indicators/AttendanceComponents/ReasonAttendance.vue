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
      <div class="space-y-2">
        <div v-for="com in comite" :key="com.id">
          <Collapsible>
            <CollapsibleTrigger
              class="flex justify-between items-center group w-full p-2 text-lg font-medium hover:bg-gray-100 bg-gray-50 border border-gray-300 rounded-md group transition-colors"
            >
              {{ com.name }}
              <div class="flex items-center gap-2">
                <ChevronDownIcon
                  class="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform"
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div class="">
                <div
                  v-if="com?.cores?.length === 0"
                  class="flex justify-between px-4 text-muted-foreground italic"
                >
                  <p class="py-2">No hay núcleos en este cómite</p>
                </div>
                <div v-else>
                  <div
                    v-for="core in com.cores"
                    :key="core.id"
                    class="flex shadow-sm p-2 border rounded-md justify-between hover:bg-muted"
                    @click="open(getComputo(core))"
                  >
                    <span> {{ core.name }}</span>
                    <span>{{ addIndicator(core.id) || "-" }}</span>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <div class="py-4 gap-2">
        <Card class="p-2">
          <CardTitle class="pt-2">TOTAL GENERAL</CardTitle>
          <CardContent>
            <div
              class="flex justify-between p-2 rounded-lg hover:bg-muted hover:font-medium"
              v-for="item in Reason"
            >
              <div class="flex items-center gap-2">
                <div class="rounded-full mt-2 w-2 h-2 bg-primary"></div>
                <p>{{ item }}</p>
              </div>
              <p>{{ getTotalByIndicator(item) || "-" }}</p>
            </div>
            <div class="flex justify-between p-2">
              <Label class="text-lg">Total de ausencias: </Label>
              <p class="font-bold">{{ getTotal() }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Sheet para mostrar detalles de ausentes -->
    <Sheet :open="!!currentComputo" @update:open="handleClose">
      <SheetContent class="sm:max-w-md">
        <SheetHeader>
          <SheetTitle class="text-xl">Detalles de Inasistencias</SheetTitle>
          <SheetDescription class="flex gap-2">
            <span class="font-medium">{{
              currentComputo?.minute.core?.comite.name
            }}</span>
            <Badge>{{ currentComputo?.minute.core?.name }}</Badge>
          </SheetDescription>
          <div class="py-4">
            <div>
              <Label class="text-lg">Causas de ausencia</Label>
              <div v-for="item in Reason" class="p-1 rounded-md hover:bg-muted">
                <div class="flex justify-between">
                  <Label>{{ item }}</Label>
                  <p>
                    {{ findIndicator(item)?.value || "-" }}
                  </p>
                </div>
                <div>
                  <p class="text-muted-foreground">
                    {{ findIndicator(item)?.text }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import Badge from "@/components/ui/badge/Badge.vue";
import { Card } from "@/components/ui/card";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Label from "@/components/ui/label/Label.vue";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Reason } from "@/interface/Absent";
import type { Computo } from "@/interface/Indicadores";
import type { Comite, Core } from "@/interface/Militante";
import { ChevronDownIcon } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";

const { comite, computos } = defineProps<{
  comite: Comite[];
  computos: Computo[];
}>();

const currentComputo = ref<Computo>();
const select = ref(true);

function getComputo(core: Core) {
  return computos.find((comp) => comp.minute.core?.id === core.id);
}

const open = (computo: Computo | undefined) => {
  if (!computo) toast.info("Este núcleo no tiene contenido para mostrar.");
  currentComputo.value = computo;
};

function handleClose(open: boolean) {
  if (!open) {
    currentComputo.value = undefined;
  }
}

function findIndicator(reason: Reason) {
  return currentComputo.value?.indicators.find(
    (item) => JSON.parse(item.sub).reason === reason,
  );
}

function addIndicator(id: string) {
  return computos
    .find((item) => item.minute.core?.id === id)
    ?.indicators.reduce((acc, ind) => acc + (ind.value || 0), 0);
}

function getTotalByIndicator(reason: Reason) {
  return computos?.reduce((acc, computo) => {
    const ind = computo.indicators.find(
      (i) => JSON.parse(i.sub)?.reason === reason,
    );
    return acc + (ind?.value ?? 0);
  }, 0);
}

function getTotal() {
  let total = 0;
  for (const computo of computos) {
    if (computo?.indicators[0]?.value !== null) {
      computo?.indicators?.forEach((item) => (total += item?.value || 0));
    }
  }
  return total;
}
</script>
