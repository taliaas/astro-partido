<template>
  <Card class="bg-card">
    <CardHeader>
      <CardTitle>Documentos Recientes</CardTitle>
      <CardDescription class="text-md"
        >Últimos documentos procesados (3 resultados)
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4 mt-4">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="border rounded-lg p-4 flex justify-between items-start"
        >
          <div class="flex-1">
            <div class="flex justify-between">
              <div class="flex items-center">
                <span
                  class="text-xs text-white px-3 py-1 rounded-full bg-button"
                >
                  {{ getType(doc) }}
                </span>
                <h4 class="text-base font-semibold ml-2">{{ doc.name }}</h4>
              </div>
              <div>
                <button
                  class="p-2 rounded-full hover:bg-gray-50"
                  @click="exportarActa(doc)"
                >
                  <Download class="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

            <div class="flex justify-between items-center mt-2">
              <p class="text-sm text-gray-500">{{ doc.fecha }}</p>
              <button
                class="text-blue-600 text-sm font-medium hover:underline"
                @click="openMinute(doc)"
              >
                Ver Detalles
                <ChevronRight class="w-4 h-4 inline-block ml-1" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="documents?.length === 0" class="text-center py-4">
          <p class="text-gray-700 font-semibold">No hay documentos recientes</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-background/80 backdrop-blur-sm"
      @click="isOpen = false"
    ></div>

    <!-- Dialog -->
    <div
      class="bg-background rounded-lg shadow-lg border w-full max-w-md p-6 z-50 relative"
    >
      <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
        <h2
          id="dialog-title"
          class="text-lg font-semibold leading-none tracking-tight"
        >
          Detalles del Acta
        </h2>
        <p class="text-sm text-muted-foreground">
          Información completa del documento
        </p>
      </div>

      <div class="space-y-4">
        <div class="space-y-1 sm:col-span-2">
          <p class="text-sm font-medium text-muted-foreground">Nombre</p>
          <p>{{ currentMinute.name }}</p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="space-y-1">
            <p class="text-sm font-medium text-muted-foreground">Estado</p>
            <p
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
            >
              {{ currentMinute.status }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium text-muted-foreground">Tipo</p>
            <p class="uppercase">{{ currentMinute.type }}</p>
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium text-muted-foreground">Fecha</p>
            <p>{{ currentMinute.fecha }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-muted-foreground">Núcleo</p>
            <p>{{ currentMinute.core?.name }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-6">
        <Button @click="isOpen = false"> Cerrar </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type MinuteOrdinary from "@/interface/MinuteOrdinary.ts";
import type MinutePolitical from "@/interface/MinutePolitical.ts";
import { exportarRO } from "@/lib/export_ro.ts";
import { exportar } from "@/lib/export_cp.ts";
import { ChevronRight, Download, XIcon } from "lucide-vue-next";
import { ref } from "vue";

const { documents } = defineProps<{ documents: any[] }>();

const isOpen = ref(false);
const currentMinute = ref(null);
const getType = (doc: AppDocument) => {
  return doc?.type === "ro" ? "Ordinaria" : "Círculo Político";
};

async function openMinute(doc: any) {
  isOpen.value = true;
  currentMinute.value = doc;
}

async function exportarActa(doc: MinuteOrdinary | MinutePolitical) {
  //corregir porque puede ser un acta cargada
  if (doc?.type === "ro") {
    exportarRO(doc);
  } else {
    exportar(doc);
  }
}
</script>
