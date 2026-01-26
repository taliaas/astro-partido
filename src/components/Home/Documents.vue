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
                  class="text-sm text-white px-3 py-1 rounded-full bg-button"
                >
                  {{ doc.type }}
                </span>
                <h4 class="text-base font-semibold ml-2">{{ doc.name }}</h4>
              </div>
              <div>
                <Button
                  variant="outline"
                  class="p-2 rounded-full hover:bg-gray-50"
                  @click="exportarActa(doc)"
                >
                  <Download class="w-4 h-4 text-gray-700" />
                </Button>
              </div>
            </div>
            <div class="flex justify-between items-center mt-2">
              <p class="text-sm text-gray-500">{{ doc.createdAt }}</p>
              <Button
                variant="link"
                class="text-blue-600 text-sm font-medium hover:underline"
                @click="openMinute(doc)"
              >
                Ver Detalles
                <ChevronRight class="w-4 h-4 inline-block ml-1" />
              </Button>
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
          <p>{{ currentMinute?.name }}</p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="space-y-1">
            <p class="text-sm font-medium text-muted-foreground">Estado</p>
            <p
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
            >
              {{ currentMinute?.status }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium text-muted-foreground">Tipo</p>
            <p class="">
              {{ currentMinute?.type ? "Ordinaria" : "Extraordinaria" }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium text-muted-foreground">Fecha</p>
            <p>{{ currentMinute?.date }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-muted-foreground">Núcleo</p>
            <p>{{ currentMinute?.core?.name }}</p>
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { exportarCP } from "@/lib/export_cp";
import { exportarRO } from "@/lib/export_ro.ts";
import { ChevronRight, Download } from "lucide-vue-next";
import { ref } from "vue";

const { documents } = defineProps<{ documents: any[] }>();

interface Data {
  name: string;
  type: string;
  status: string;
  date: Date;
  core: { id: number; name: string };
}

const isOpen = ref(false);
const currentMinute = ref<Data>();

async function openMinute(doc: any) {
  isOpen.value = true;
  currentMinute.value = doc;
}

async function exportarActa(doc: any) {
  //corregir porque puede ser un acta cargada y los tipos no son asi
  if (doc?.type === "ro") {
    exportarRO(doc);
  } else {
    exportarCP(doc);
  }
}
</script>
