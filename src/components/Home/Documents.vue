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
                @click="openMinute(doc.id)"
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
import { navigate } from "astro:transitions/client";
import type MinuteOrdinary from "@/interface/MinuteOrdinary.ts";
import type MinutePolitical from "@/interface/MinutePolitical.ts";
import { exportarRO } from "@/lib/export_ro.ts";
import { exportar } from "@/lib/export_cp.ts";
import { Download, ChevronRight } from "lucide-vue-next";

const { documents } = defineProps<{ documents: any[] }>();
const getType = (doc: AppDocument) => {
  return doc?.name === "Acta Ordinaria" ? "Ordinaria" : "Estudio Político";
};

async function openMinute(id: string) {
  await navigate(`/view/${id}`);
}

async function exportarActa(doc: MinuteOrdinary | MinutePolitical) {
  if (doc?.name === "Acta Ordinaria") {
    exportarRO(doc);
  } else {
    exportar(doc);
  }
}
</script>
