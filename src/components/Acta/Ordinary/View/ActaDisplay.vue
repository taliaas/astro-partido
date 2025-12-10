<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-400 mx-auto">
      <Card class="w-full bg-background p-6 shadow-md">
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle class="text-3xl font-bold">
              {{ minute?.name }} {{ minute?.id }}
              <Badge variant="outline">{{ minute.status }}</Badge>
            </CardTitle>
            <Button variant="outline" @click="exportar">
              <DownloadIcon class="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref="info" class="space-y-8">
            <!-- Información General -->
            <section>
              <div class="flex text-lg gap-6 w-full justify-between">
                <div class="card">
                  <span class="font-medium text-gray-700">Núcleo:</span>
                  {{ minute?.core?.name }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Lugar:</span>
                  {{ minute?.place }}
                  <span v-if="!minute.place">-</span>
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Fecha:</span>
                  {{ minute?.date }}
                  <span v-if="!minute.date">-</span>
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Hora:</span>
                  {{ minute?.hour }}
                  <span v-if="!minute.hour">-</span>
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Ausentes:</span>
                  {{ abscents?.length }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Total:</span>
                  {{ minute?.core?.militants?.length }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Porciento:</span>
                  {{ porciento.toFixed(2) }}%
                </div>
              </div>
            </section>

            <!-- Asistencia -->
            <section title="Miembros" class="gap-2">
              <div class="text-2xl font-semibold text-gray-800 mb-2">
                <h2>Relación de asistencia</h2>
              </div>
              <Table
                v-if="minute?.core?.militants?.length"
                class="text-md rounded-lg border border-gray-300"
              >
                <TableHeader class="bg-gray-100">
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellidos</TableHead>
                    <TableHead class="text-center">Presente</TableHead>
                    <TableHead class="text-center">Causa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="miembro in list()" :key="miembro.nro">
                    <TableCell>{{ miembro.id }}</TableCell>
                    <TableCell>{{ miembro.firstname }}</TableCell>
                    <TableCell>{{ miembro.lastname }}</TableCell>
                    <TableCell class="text-center">
                      <Badge v-if="miembro.ausente === 'ausente'"
                        >Ausente
                      </Badge>
                      <Badge v-else-if="miembro.presente === 'Virtual'"
                        >Virtual
                      </Badge>
                      <span v-else>Presente</span>
                    </TableCell>
                    <TableCell class="text-center">
                      {{ miembro.reason || "-" }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            <!-- Orden del día -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-800 mb-2">
                Orden del día
              </h2>
              <ol class="list-decimal list-inside space-y-1 text-blue-600">
                <li
                  v-for="(item, index) in minute?.ordinary?.order"
                  :key="index"
                  class="text-lg text-gray-800 pl-4"
                >
                  {{ item }}
                </li>
              </ol>
            </section>

            <!-- Desarrollo de la reunión -->
            <section title="Desarrollo de la reunión">
              <h2 class="text-2xl font-semibold text-gray-800 mb-2">
                Desarrollo de la reunión
              </h2>
              <Accordion type="single" collapsible>
                <AccordionItem
                  v-if="minute?.ordinary?.development?.length !== 0"
                  v-for="(item, index) in minute?.ordinary?.development"
                  :key="item.id"
                  :value="item.id"
                >
                  <AccordionTrigger class="text-lg">
                    {{ index + 1 }}.
                    {{
                      minute?.ordinary?.order?.[index] || ""
                    }}</AccordionTrigger
                  >
                  <AccordionContent class="space-y-2">
                    <div>
                      <span class="text-lg font-medium">
                        <span
                          class="font-normal text-muted-foreground"
                          v-if="!minute?.ordinary?.development[index]?.content"
                        >
                          No hay contenido
                        </span>
                        <span v-else class="font-normal">
                          Debate:
                          {{
                            minute?.ordinary?.development[index].content
                          }}</span
                        >
                      </span>
                    </div>
                    <div class="space-y-2">
                      <h2
                        v-if="
                          minute.ordinary?.development[index].agreements.length
                        "
                        class="text-lg font-medium"
                      >
                        Acuerdos
                      </h2>
                      <h2 v-else class="text-muted-foreground">
                        No hay acuerdos asociados a este punto
                      </h2>
                      <ul class="text-lg">
                        <li
                          v-for="(agreement, i) in minute.ordinary?.development[
                            index
                          ].agreements"
                          :key="agreement.id"
                        >
                          <div class="space-x-2">
                            <Badge variant="outline">{{
                              agreement.status
                            }}</Badge>
                            <span>
                              {{ i + 1 }}. {{ agreement.descripcion }}</span
                            >
                          </div>
                          <div class="flex space-x-3 font-medium">
                            <span
                              >Responsable:
                              <span
                                class="font-normal"
                                v-if="
                                  agreement.responsable?.firstname &&
                                  agreement.responsable?.lastname
                                "
                              >
                                {{ agreement.responsable?.firstname }}
                                {{ agreement.responsable?.lastname }}
                              </span>
                              <span class="font-normal" v-else>-</span>
                            </span>
                            <div class="flex space-x-2">
                              Participantes:
                              <span
                                v-if="!agreement.participants.length"
                                class="font-normal"
                                >-</span
                              >
                              <span v-for="item in agreement.participants">
                                <span
                                  class="font-normal"
                                  v-if="item.firstname && item.lastname"
                                >
                                  {{ item.firstname }}
                                  {{ item.lastname }}
                                </span>
                                <span class="font-normal" v-else>-</span>
                              </span>
                            </div>
                          </div>
                          <div class="flex space-x-3 font-medium">
                            <span>
                              Fecha de creación:
                              <span class="font-normal">{{
                                agreement.created || "-"
                              }}</span>
                            </span>
                            <span
                              >Fecha de finalización:
                              <span class="font-normal">{{
                                agreement.enddate || "-"
                              }}</span></span
                            >
                          </div>
                        </li>
                        {{}}
                      </ul>
                    </div>
                    <div class="space-y-2">
                      <h2
                        v-if="
                          minute.ordinary?.development[index].workplan?.length
                        "
                        class="text-lg font-medium"
                      >
                        Plan de trabajo
                      </h2>
                      <ul class="text-lg">
                        <li
                          v-for="(plan, i) in minute.ordinary?.development[
                            index
                          ].workplan"
                          :key="plan.id"
                        >
                          <div class="space-x-2">
                            <Badge variant="outline">{{ plan.status }}</Badge>
                            <span> {{ i + 1 }}. {{ plan.descripcion }}</span>
                          </div>
                          <div class="flex space-x-3 font-medium">
                            <span
                              >Responsable:
                              <span
                                class="font-normal"
                                v-if="
                                  plan.responsable?.firstname &&
                                  plan.responsable?.lastname
                                "
                              >
                                {{ plan.responsable?.firstname }}
                                {{ plan.responsable?.lastname }}
                              </span>
                              <span class="font-normal" v-else>-</span>
                            </span>
                            <div class="flex space-x-2">
                              Participantes:
                              <span
                                v-if="!plan.participants.length"
                                class="font-normal"
                                >-</span
                              >
                              <span v-for="item in plan.participants">
                                <span
                                  class="font-normal"
                                  v-if="item.firstname && item.lastname"
                                >
                                  {{ item.firstname }}
                                  {{ item.lastname }}
                                </span>
                                <span class="font-normal" v-else>-</span>
                              </span>
                            </div>
                          </div>
                          <div class="flex space-x-3 font-medium">
                            <span>
                              Fecha de creación:
                              <span class="font-normal">{{
                                plan.created || "-"
                              }}</span>
                            </span>
                            <span
                              >Fecha de finalización:
                              <span class="font-normal">{{
                                plan.enddate || "-"
                              }}</span></span
                            >
                          </div>
                        </li>
                        {{}}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <!-- Próximas fechas -->
            <section class="space-y-2">
              <h2 class="text-2xl font-semibold text-gray-800 my-4">
                Próximas fechas
              </h2>
              <div class="text-lg text-gray-600">
                <div class="flex gap-3">
                  <span class="font-medium"
                    >Fecha de la Próxima Reunión Ordinaria:</span
                  >
                  {{ minute?.ordinary?.fechaProx || "-" }}
                </div>
                <div class="flex gap-3">
                  <span class="font-medium"
                    >Fecha de la Preparación de la Próxima Reunión
                    Ordinaria:</span
                  >
                  {{ minute?.ordinary?.fechaPrep || "-" }}
                </div>
                <div class="flex gap-3">
                  <span class="font-medium"
                    >Fecha del Próximo Círculo de Estudios Políticos:</span
                  >
                  {{ minute?.ordinary?.fechaCP || "-" }}
                </div>
              </div>
            </section>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end border-t p-6">
          <div class="flex gap-5" v-if="minute?.status === 'Pendiente'">
            <Button @click="openProcesar"> Procesar </Button>
          </div>
          <div v-if="existsCP">
            <Button
              type="button"
              variant="ghost"
              class="p-6 text-md font-medium text-gray-700 hover:bg-gray-100"
              @click="$emit('move')"
            >
              Acta de Círculo Político
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type Minute from "@/interface/Minute";
import { exportarRO } from "@/lib/export_ro.ts";
import { navigate } from "astro:transitions/client";
import { ArrowRight, DownloadIcon } from "lucide-vue-next";
import { ref } from "vue";

const { minute, existsCP, abscents } = defineProps<{
  minute: Minute;
  existsCP?: boolean;
  abscents: any[];
}>();

defineEmits(["move"]);

const info = ref<HTMLElement | null>(null);
let porciento = 0;
if (minute?.core?.militants?.length) {
  porciento =
    abscents?.length === 0
      ? 100
      : (abscents.length * 100) / minute.core.militants.length;
}

const exportar = () => {
  exportarRO(minute);
};

const list = () => {
  return minute.core?.militants?.map((militante: any) => {
    const ausencia = minute.abscents?.find(
      (a: any) => a.militante?.id === militante?.id
    );
    return {
      ...militante,
      reason: ausencia?.reason,
    };
  });
};

function openProcesar() {
  navigate(`/indicadores/${minute.id}`);
}
</script>
