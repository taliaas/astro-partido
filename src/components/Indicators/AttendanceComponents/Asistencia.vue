<template>
  <div>
    <!-- Leyenda de columnas (discreta, no como tabla) -->
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
            <Card class="my-2">
              <CardContent class="p-4">
                <div
                  v-if="com?.cores?.length === 0"
                  class="flex justify-between px-4 text-muted-foreground italic"
                >
                  <p class="py-2">No hay núcleos en este cómite</p>
                </div>
                <div v-else>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Núcleos</TableHead>
                        <TableHead class="text-center"
                          >Fecha de Reunión</TableHead
                        >
                        <TableHead class="text-center"
                          >Fecha de Entrega</TableHead
                        >
                        <TableHead class="text-center" :colSpan="3">
                          Total militantes
                        </TableHead>
                        <!-- <TableHead class="text-center"
                          >Posibles a asistir</TableHead
                        >
                        <TableHead class="text-center" :colSpan="3">
                          Asisten
                        </TableHead> -->
                        <TableHead class="text-center">%</TableHead>
                      </TableRow>
                      <TableRow
                        class="text-xs font-medium text-muted-foreground *:py-0 *:h-8"
                      >
                        <TableHead></TableHead>
                        <TableHead></TableHead>
                        <TableHead></TableHead>
                        <TableHead>INFOEST</TableHead>
                        <TableHead>por Acta</TableHead>
                        <TableHead>Dif</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow
                        v-for="core of com.cores"
                        :key="core.id"
                        @click="open(getComputo(core.id))"
                      >
                        <TableCell>{{ core?.name || "-" }}</TableCell>
                        <TableCell class="text-center">{{
                          getComputo(core?.id)?.minute.date || "-"
                        }}</TableCell>
                        <TableCell class="text-center">{{
                          getComputo(core?.id)?.minute.createdAt || "-"
                        }}</TableCell>
                        <TableCell>{{
                          getComputo(core?.id)?.minute.core?.militants.length
                        }}</TableCell>
                        <TableCell>{{
                          getComputo(core?.id)?.indicators[0].value
                        }}</TableCell>
                        <TooltipProvider>
                          <Tooltip
                            class="hover:bg-muted dark:hover:bg-gray-700 rounded-full"
                          >
                            <TooltipTrigger as-child>
                              <TableCell
                                :class="
                                  difference(getComputo(core?.id)) < 0
                                    ? 'text-red-600 font-bold'
                                    : ''
                                "
                              >
                                {{ difference(getComputo(core?.id)) }}
                              </TableCell>
                            </TooltipTrigger>
                            <TooltipContent
                              align="center"
                              side="top"
                              :align-offset="0"
                              :collision-padding="0"
                              :arrow-padding="0"
                              sticky="always"
                            >
                              <p v-if="difference(getComputo(core?.id)) < 0">
                                Atención: la cantidad de militantes por Acta es
                                mayor que la cantidad de INFOEST
                              </p>
                              <p v-else>
                                Diferencia entre la cantidad de INFOEST(sistema)
                                y la cantidad de militantes por Acta
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TableCell class="text-center">{{
                          porciento(getComputo(core?.id))
                        }}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>

    <Sheet :open="!!currentComputo" @update:open="handleClose" class="p-4">
      <SheetContent class="sm:max-w-md">
        <SheetHeader>
          <SheetTitle class="text-xl">Detalles de Asistencia</SheetTitle>
        </SheetHeader>
        <div class="px-4 space-y-2">
          <div class="shadow-md rounded-md space-y-2 p-4 bg-gray-50">
            <div class="flex gap-2">
              <Calendar />
              <Label class="text-md">Fechas Importantes</Label>
            </div>
            <div class="grid grid-cols-2 py-2">
              <div>
                <Label class="text-muted-foreground">Fecha de Reunión</Label>
                <p>{{ currentComputo?.minute.date || "No especificado" }}</p>
              </div>
              <div>
                <Label class="text-muted-foreground">Fecha de Creación</Label>
                <p>
                  {{ currentComputo?.minute.createdAt || "No especificado" }}
                </p>
              </div>
            </div>
          </div>
          <div class="shadow-md rounded-md space-y-2 p-4 bg-gray-50">
            <div class="flex gap-2">
              <Users2 />
              <Label class="text-md">Estadísticas de Militantes</Label>
            </div>
            <div class="grid grid-cols-4 py-2">
              <div>
                <Label class="text-muted-foreground">INFOEST</Label>
                <p class="text-2xl">
                  {{ currentComputo?.minute.core?.militants.length || 0 }}
                </p>
              </div>
              <div>
                <Label class="text-muted-foreground">por Acta</Label>
                <p class="text-2xl">
                  {{ currentComputo?.indicators[0].value || 0 }}
                </p>
              </div>
              <div>
                <Label class="text-muted-foreground">Dif</Label>
                <p
                  class="text-2xl"
                  :class="
                    difference(currentComputo) ? 'text-red-600 font-bold' : ''
                  "
                >
                  {{ difference(currentComputo) || 0 }}
                </p>
              </div>
              <div>
                <Label class="text-muted-foreground">Porciento</Label>
                <p class="text-xl">
                  {{ porciento(currentComputo) || 0 }}
                </p>
              </div>
            </div>
          </div>
          <div class="shadow-md rounded-md space-y-4 p-4 bg-gray-50">
            <div class="flex gap-2">
              <FileIcon />
              <Label class="text-md">Detalles</Label>
            </div>
            <div class="flex gap-4">
              <div>
                <Label class="text-muted-foreground">Cómite</Label>
                <p>{{ currentComputo?.minute.core?.comite.name }}</p>
              </div>
              <div>
                <Label class="text-muted-foreground">Núcleo</Label>
                <p>{{ currentComputo?.minute.core?.name }}</p>
              </div>
            </div>
            <div>
              <Label class="text-muted-foreground">Contenido del Acta</Label>

              <p>
                {{ currentComputo?.indicators[0].text || "No especificado" }}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

import Label from "@/components/ui/label/Label.vue";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TooltipProvider from "@/components/ui/tooltip/TooltipProvider.vue";
import TooltipTrigger from "@/components/ui/tooltip/TooltipTrigger.vue";
import type { Computo } from "@/interface/Indicadores";
import type { Comite } from "@/interface/Militante";
import { Calendar, ChevronDownIcon, FileIcon, Users2 } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";

const { comite, computos } = defineProps<{
  comite: Comite[];
  computos: Computo[];
}>();

const currentComputo = ref<Computo>();

const difference = (computo: Computo | undefined) => {
  if (!computo) return 0;
  const total = computo.minute.core?.militants.length || 0;
  const cantByMinute = computo.indicators[0].value || 0;
  return total - cantByMinute;
};

function getComputo(coreId: string) {
  return computos.find((comp) => comp.minute.core?.id === coreId);
}

function handleClose(open: boolean) {
  if (!open) {
    currentComputo.value = undefined;
  }
}

function porciento(computo: Computo | undefined) {
  if (!computo) return 0;
  const total = computo.minute.core?.militants.length || 0;
  const cant = computo.indicators[0].value || 0;
  const porciento = (cant * 100) / total;
  return total === 0 ? "-" : porciento.toFixed(2);
}

const open = (computo: Computo | undefined) => {
  if (!computo) toast.info("Este núcleo no tiene contenido para mostrar.");
  currentComputo.value = computo;
};
</script>
