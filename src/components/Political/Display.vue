<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto shadow-md">
      <Card class="w-full">
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle class="text-3xl font-bold">
              {{ acta.name }} {{ acta.id }}
            </CardTitle>
            <Button variant="outline" @click="exportarActa">
              <DownloadIcon class="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref="infoActa" class="space-y-8">
            <!-- Información General -->
            <section>
              <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Información General
              </h2>
              <div class="flex text-lg justify-between p-2">
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
                  {{ acta.ausentes }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Total:</span>
                  {{ acta.total }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Porciento:</span>
                  {{ acta.porciento }}
                </div>
              </div>
            </section>

            <!-- Asistencia -->
            <section title="Asistencia">
              <div class="grid grid-cols-2 gap-4 text-lg text-gray-700">
                <div class="flex">
                  <h3 class="font-medium text-gray-700">
                    Total de trabajadores:
                  </h3>
                  <p class="ml-8">{{ acta.total_trabajador }}</p>
                </div>
                <div class="flex">
                  <h3 class="font-medium text-gray-700">
                    Total del organismo superior:
                  </h3>
                  <p class="ml-8">{{ acta.total_organismo }}</p>
                </div>
              </div>
              <div v-if="acta.causa.length !== 0">
                <h3 class="font-medium text-lg text-gray-700 my-4">Causas:</h3>
                <div
                  v-for="(causa, index) in acta.causa"
                  :key="index"
                  class="flex mb-4 bg-gray-100 p-2 rounded text-gray-700 pl-4 font-medium"
                >
                 <div>Nombre: {{ JSON.parse(causa).nombre }} | Motivo: {{ JSON.parse(causa).motivo }}</div>
                </div>
              </div>
            </section>

            <!-- Orden del día -->
            <section>
              <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Tema evaluado en la reunión
              </h2>
              <p class="text-md p-2">{{ acta.tema }}</p>
            </section>

            <!-- Desarrollo de la reunión -->
            <section title="Planteamientos">
              <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Principales planteamientos realizados
              </h2>
              <div class="mb-4 text-md pr-6 pl-2">
                <p class="text-justify">{{ acta.planteamientos }}</p>
              </div>
            </section>
            <section title="Valoracion">
              <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Valoración
              </h2>
              <p class="text-md p-2">{{ acta.valoracion }}</p>
            </section>

            <!-- Próximas fechas -->
            <section class="">
              <h2 class="text-xl font-semibold text-gray-800 my-4">Firmas</h2>
              <div
                class="flex flex-col space-y-4 text-lg p-2 text-gray-700 font-semibold"
              >
                <div class="flex gap-4">
                  Orientador Político:
                  <p class="font-normal">{{ acta.name_orientador }}</p>
                </div>
                <div class="flex gap-4">
                  Secretario del Núcleo:
                  <p class="font-normal">{{ acta.name_secretario }}</p>
                </div>
              </div>
            </section>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end border-t p-6">
          <div class="flex gap-5" v-if="acta.status === 'Pendiente'">
            <button
              class="bg-blue-600 text-white text-md font-medium px-4 py-2 rounded hover:bg-blue-700 hover:shadow-md"
              @click="updateStatus(Status.A)"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Aprobando..." : "Aprobada" }}
            </button>
          </div>
          <div v-if="acta.status === 'Aprobada'">
            <Button
              type="button"
              variant="ghost"
              class="px-4 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100"
              @click="$emit('move')"
            >
              <ArrowLeft class="w-4 h-4" />
              Acta Ordinaria
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Status } from "@/enum/Status.ts";
import { exportar } from "@/lib/export_cp";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { ArrowLeft, DownloadIcon } from "lucide-vue-next";
import { ref } from "vue";

const { acta } = defineProps<{
  acta: any;
}>();

defineEmits(["move"]);

const infoActa = ref<HTMLElement | null>(null);
const isSubmitting = ref(false);
const updateStatus = async (status: string) => {
  isSubmitting.value = true;
  try {
    await actions.political.updateStatusMinutes({ id: acta.id, status });

    await navigate("/minutes");
  } catch (e) {
    console.error(e);
  } finally {
    isSubmitting.value = false;
  }
};
const exportarActa = () => {
  exportar(acta);
};
</script>