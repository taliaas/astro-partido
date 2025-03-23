<template>
  <Card class="bg-secondary">
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
          class="border rounded-lg p-4 flex justify-between"
        >
          <div class="">
            <h3 class="text-lg font-semibold mb-2 pl-2">{{doc.name}} {{ doc.id }}</h3>
            <p class="text-sm text-muted-foreground font-medium pl-3 mb-2">{{ doc.fecha }}</p>

            <Button
                variant="link"
                @click="openMinute(doc.id)"
                class="hover:text-blue-600"
                size="sm"
            >Ver Detalles</Button
            >
          </div>
          <div class="flex space-y-2 flex-col ">
            <Button
              variant="ghost"
              class="border border-gray-200 hover:border-gray-200"
              size="sm"
              @click="exportarActa(doc)"
              >
              <Download class="w-4 h-4" />
            </Button
            >
          </div>
        </div>
        <div v-if="documents?.length === 0">
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
import {exportarRO} from "@/lib/export_ro.ts";
import {exportar} from "@/lib/export_cp.ts";
import {Download} from "lucide-vue-next";

const { documents } = defineProps<{ documents: any[] }>();

async function openMinute(id: string) {
  await navigate(`/view/${id}`);
}

async function exportarActa(doc: MinuteOrdinary | MinutePolitical){
  if(doc?.name === 'Acta Ordinaria'){
    const expo = exportarRO(doc);
    console.log(expo)
  }
  else{
    exportar(doc)
  }
}
</script>