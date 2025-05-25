<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-400 mx-auto">
      <Card class="w-full bg-background p-6 shadow-md">
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle class="text-3xl font-bold">
              {{ acta.name }} {{ acta.id }}
            </CardTitle>
            <Button variant="outline" @click="exportar">
              <DownloadIcon class="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref="infoActa" class="space-y-8">
            <!-- Información General -->
            <section>
              <div class="flex text-lg gap-6">
                <div class="card">
                  <span class="font-medium text-gray-700">Núcleo:</span>
                  {{ acta.core?.name }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Lugar:</span>
                  {{ acta.lugar }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Fecha:</span>
                  {{ acta.fecha }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Hora:</span>
                  {{ acta.hora }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Ausentes:</span>
                  {{ acta.abscents.length }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Total:</span>
                  {{ acta.militante.length }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Porciento:</span>
                  {{ porciento.toFixed(2) }}%
                </div>
              </div>
            </section>

            <!-- Asistencia -->
            <section title="Miembros">
              <Table
                v-if="acta.militante.length"
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
                      <Badge
                        v-if="miembro.ausente === 'ausente'"
                        variant="success"
                        >Ausente
                      </Badge>
                      <Badge
                        v-else-if="miembro.presente === 'Virtual'"
                        variant="info"
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
                  v-for="(item, index) in acta.order"
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
              <Accordion type="single" collapsible class="text-xl">
                <AccordionItem value="item-1" v-if="acta.chequeo.length !== 0">
                  <AccordionTrigger> Chequeo de acuerdos</AccordionTrigger>
                  <AccordionContent>
                    <h3 class="text-lg mb-2">
                      {{ acta.chequeo }}
                    </h3>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-2"
                  v-if="acta.orientaciones.length !== 0"
                >
                  <AccordionTrigger>
                    Orientaciones del Organismo Superior
                  </AccordionTrigger>
                  <AccordionContent>
                    <p class="text-lg">
                      {{ acta.orientaciones }}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" v-if="acta.analisis.length !== 0">
                  <AccordionTrigger> Análisis</AccordionTrigger>
                  <AccordionContent>
                    <p class="text-lg">{{ acta.analisis }}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-4"
                  v-if="acta.agreements.length !== 0"
                >
                  <AccordionTrigger> Acuerdos</AccordionTrigger>
                  <AccordionContent>
                    <ul class="space-y-4">
                      <li
                        v-for="(acuerdo, index) in acta.agreements"
                        :key="index"
                        class="border-t pb-4"
                      >
                        <div class="flex gap-4 text-lg mt-2">
                          <span class="font-medium"
                            >Acuerdo {{ acuerdo.id }}:</span
                          >
                          <p class="text-lg">{{ acuerdo.descripcion }}</p>
                        </div>
                        <div class="mt-2 text-lg">
                          <span class="font-medium">Responsable:</span>
                          {{ acuerdo.responsable }} |
                          <span class="font-medium"
                            >Fecha de cumplimiento:</span
                          >
                          {{ acuerdo.fecha }}
                        </div>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-5"
                  v-if="acta.extranjero.length !== 0"
                >
                  <AccordionTrigger> Salidas al extranjero</AccordionTrigger>
                  <AccordionContent>
                    <ul class="space-y-4">
                      <li
                        v-for="(salida, index) in acta.extranjero"
                        :key="index"
                        class="pb-4"
                      >
                        <div class="flex gap-4">
                          <p class="font-medium text-lg">
                            Salida {{ salida.id }}:
                          </p>
                          <p class="text-lg">{{ salida.nombre }}</p>
                        </div>
                        <div class="flex gap-4">
                          <span class="font-medium text-lg"
                            >Motivo del viaje:</span
                          >
                          <p class="text-lg">{{ salida.motivo }}</p>
                        </div>
                        <div class="mt-2 text-lg gap-4">
                          <span class="font-medium">País:</span>
                          {{ salida.destino }} |
                          <span class="font-medium">Fechas:</span>
                          {{ salida.fechaIda }} al {{ salida.fechaRegreso }}
                        </div>
                      </li>
                    </ul>
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
                  {{ acta.fechaProx }}
                </div>
                <div class="flex gap-3">
                  <span class="font-medium"
                    >Fecha de la Preparación de la Próxima Reunión
                    Ordinaria:</span
                  >
                  {{ acta.fechaPrep }}
                </div>
                <div class="flex gap-3">
                  <span class="font-medium"
                    >Fecha del Próximo Círculo de Estudios Políticos:</span
                  >
                  {{ acta.fechaCP }}
                </div>
              </div>
            </section>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end border-t p-6">
          <div class="flex gap-5" v-if="acta.status === 'Pendiente'">
            <Button
              type="button"
              variant="ghost"
              :disabled="isRechSubmitting"
              class="p-4 bg-gray-100 text-md font-medium text-gray-700 hover:bg-gray-200 hover:shadow-md"
              @click="updateStatus(Status.R)"
            >
              {{ isRechSubmitting ? "Rechazando..." : "Rechazada" }}
            </Button>
            <button
              type="button"
              class="bg-blue-600 text-white text-md font-medium px-4 rounded hover:bg-blue-700 hover:shadow-md"
              @click="updateStatus(Status.A)"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Aprobando..." : "Aprobada" }}
            </button>
          </div>
          <div v-else-if="existsCP">
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
import {ref} from "vue";
import {ArrowRight, DownloadIcon} from "lucide-vue-next";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "../ui/accordion";
import {Status} from "@/enum/Status.ts";
import {navigate} from "astro:transitions/client";
import {exportarRO} from "@/lib/export_ro.ts";
import {actions} from "astro:actions";

const { acta, existsCP } = defineProps<{
  acta: any;
  existsCP?: boolean;
}>();
console.log("Acta Ordinaria", existsCP);
defineEmits(["move"]);

const isSubmitting = ref(false);
const isRechSubmitting = ref(false);
const infoActa = ref<HTMLElement | null>(null);
const totalMilitantes = acta.militante.length || 0;
const totalAusentes = acta.abscents.length || 0;
const presente = totalMilitantes - totalAusentes;
const porciento = totalMilitantes > 0 ? (presente * 100) / totalMilitantes : 0;

const exportar = () => {
  exportarRO(acta);
};

const updateStatus = async (status) => {
  isSubmitting.value = true;
  try {
    await actions.ordinary.updateStatusMinutes({id:acta.id,status})
    await navigate("/minutes");
  } catch (e) {
    throw new Error(e);
  } finally {
    isSubmitting.value = false;
  }
};

const list = () => {
  return acta.militante.map((militante) => {
    const ausencia = acta.abscents.find(
      (a) => a.militante?.id === militante?.id,
    );
    console.log(acta.abscents);
    return {
      ...militante,
      reason: ausencia?.reason,
    };
  });
};
</script>

<style scoped>
@reference "tailwindcss";

@layer components {
  .card {
    @apply border flex flex-col rounded-lg p-2 px-4 w-fit text-gray-600 min-w-32;
  }
}
</style>
