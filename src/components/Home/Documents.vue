<template>
  <Card>
    <CardHeader>
      <CardTitle>Documentos Recientes</CardTitle>
      <CardDescription
        >Últimos documentos procesados por el sistema</CardDescription
      >
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="border rounded-lg p-4"
        >
          <h3 class="font-semibold mb-2">{{doc.name}} {{ doc.id }}</h3>
          <p class="text-sm text-muted-foreground mb-2">{{ doc.fecha }}</p>
          <div class="flex space-x-2">
            <Button
              variant="outline"
              @click="openMinute(doc.id)"
              class="rounded border-gray-300 shadow-md"
              size="sm"
              >Ver Detalles</Button
            >
            <Button
              variant="outline"
              class="rounded border-gray-300 shadow-md"
              size="sm"
              @click="exportarActa(doc)"
              >Descargar</Button
            >
          </div>
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
import { computed } from "vue";
import { ref } from "vue";
import type MinuteOrdinary from "@/interface/MinuteOrdinary.ts";
import type MinutePolitical from "@/interface/MinutePolitical.ts";
import {exportarRO} from "@/lib/export_ro.ts";
import {exportar} from "@/lib/export_cp.ts";

const { documents } = defineProps<{ documents: any[] }>();
const filters = ref("");

const filteredActas = computed(() => {
  return actas.filter((item) => {
    if (filters.value && item.core.name !== filters.value) return false;
    return true;
  });
});

async function openMinute(id: string) {
  await navigate(`/view/${id}`);
}

async function exportarActa(doc: MinuteOrdinary | MinutePolitical){
  if(doc?.name === 'Acta Ordinaria'){
    exportarRO(doc)
  }
  else{
    exportar(doc)
  }
}
</script>