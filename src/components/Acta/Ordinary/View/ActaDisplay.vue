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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Label from "@/components/ui/label/Label.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusAtte } from "@/enum/Estado";
import type Minute from "@/interface/Minute";
import { exportarRO } from "@/lib/export_ro.ts";
import { navigate } from "astro:transitions/client";
import { format } from "date-fns";
import { ArrowRight, DownloadIcon } from "lucide-vue-next";

const { minute, existsCP, abscents } = defineProps<{
  minute: Minute;
  existsCP?: boolean;
  abscents: any[];
}>();

defineEmits(["move"]);
let porciento = 0;
if (minute?.core?.militants?.length) {
  const parte = minute.core.militants.length - abscents.length;
  porciento =
    abscents?.length === 0 ? 100 : (parte * 100) / minute.core.militants.length;
}

const exportar = () => {
  exportarRO(minute);
};

const list = () => {
  return minute.core?.militants?.map((militante: any) => {
    const ausencia = minute.abscents?.find(
      (a: any) => a.militante?.id === militante?.id,
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
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-400 mx-auto p-2">
      <Card class="w-full bg-background p-6 shadow-md">
        <CardHeader class="flex justify-between">
          <div>
            <CardTitle class="text-3xl font-bold">
              {{ minute?.name }} {{ minute.id }}
            </CardTitle>
            <CardDescription>
              {{ minute.type }}
              <Badge variant="outline">{{ minute.status }}</Badge>
            </CardDescription>
          </div>
          <Button variant="outline" @click="exportar">
            <DownloadIcon class="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
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

                  {{
                    minute.date
                      ? format(new Date(minute.date), "dd/MM/yyyy")
                      : "-"
                  }}
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
                <TableHeader class="bg-gray-100 uppercase">
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Nombre y Apellidos</TableHead>
                    <TableHead>Presente</TableHead>
                    <TableHead class="text-center">Causa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="(item, index) in minute.abscents"
                    :key="item.id"
                  >
                    <TableCell>{{ index + 1 }}</TableCell>
                    <TableCell
                      >{{ item.militant.firstname }}
                      {{ item.militant.lastname }}</TableCell
                    >
                    <TableCell>
                      <Badge v-if="item.estado === StatusAtte.A"
                        >Ausente
                      </Badge>
                      <Badge v-else-if="item.estado === StatusAtte.V"
                        >Virtual
                      </Badge>
                      <Badge v-else variant="outline">Presente</Badge>
                    </TableCell>
                    <TableCell class="text-center">
                      {{ item.estado !== StatusAtte.A ? "-" : item.reason }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            <section title="Invitados">
              <div class="">
                <Label class="text-2xl py-2">Participantes</Label>
                <Table class="text-md rounded-lg border border-gray-300">
                  <TableHeader class="bg-gray-100 uppercase">
                    <TableHead>No.</TableHead>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Cargo</TableHead>
                  </TableHeader>
                  <TableBody
                    v-for="(item, index) in minute.invitados"
                    :key="item.id"
                  >
                    <TableRow>
                      <TableCell class="p-2">{{ index + 1 }}</TableCell>
                      <TableCell class="p-2">{{
                        item.nombre_apellidos || "-"
                      }}</TableCell>
                      <TableCell class="p-2">{{ item.cargo }}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div
                  v-if="!minute.invitados.length"
                  class="p-6 border text-muted-foreground text-center"
                >
                  No hay invitados para esta acta
                </div>
              </div>
            </section>
            <!-- Orden del día -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-800 mb-2">
                Orden del día
              </h2>
              <p
                class="text-muted-foreground"
                v-if="!minute.ordinary?.development.length"
              >
                No hay desarrollo
              </p>
              <ol
                v-else
                class="list-decimal list-inside space-y-1 text-blue-600"
              >
                <li
                  v-for="(item, index) in minute.ordinary?.development"
                  :key="index"
                  class="text-lg text-gray-800 pl-4"
                >
                  {{ item.order }}
                </li>
              </ol>
            </section>
            <section>
              <h2 class="text-2xl font-semibold text-gray-800 mb-2">
                Desarrollo
              </h2>
              <p
                class="text-muted-foreground"
                v-if="!minute.ordinary?.development.length"
              >
                No hay desarrollo
              </p>
              <Accordion
                type="single"
                collapsible
                v-for="(development, index) in minute.ordinary?.development"
              >
                <AccordionItem
                  v-if="minute.ordinary?.development.length !== 0"
                  :value="development.id"
                >
                  <AccordionTrigger class="text-lg">
                    {{ index + 1 }}.
                    {{ development.order || "-" }}</AccordionTrigger
                  >
                  <AccordionContent class="space-y-2">
                    <div>
                      <span class="text-lg font-medium">
                        <span
                          class="font-normal text-muted-foreground"
                          v-if="!development.content"
                        >
                          No hay contenido
                        </span>
                        <span v-else class="font-normal flex">
                          <p class="font-semibold">Debate:</p>
                          <p>
                            {{ development.content }}
                          </p>
                        </span>
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
        <CardFooter class="flex justify-end p-6">
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
