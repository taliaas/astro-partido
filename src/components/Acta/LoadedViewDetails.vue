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
import { ArrowLeft } from "lucide-vue-next";
import { computed } from "vue";

const { acta } = defineProps<{
  acta: any;
}>();

const url = computed(() => {
  if (!acta?.data) return '';
  // Si acta.data es base64, decodifica. Si es ArrayBuffer/Uint8Array, úsalo directo
  let byteArray;
  if (typeof acta.data === 'string') {
    // Asume base64
    const binary = atob(acta.data);
    byteArray = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      byteArray[i] = binary.charCodeAt(i);
    }
  } else {
    byteArray = acta.data;
  }
  const blob = new Blob([byteArray], { type: acta?.mimetype || 'application/pdf' });
  return URL.createObjectURL(blob);
});
console.log(url.value, acta);
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto shadow-md">
      <Card class="w-full">
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle class="text-3xl font-bold">
              {{ acta?.name }} {{ acta?.id }}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <embed
            :src="url"
            type="application/pdf"
            width="100%"
            height="1000"
            title="Embedded PDF Viewer"
          />
        </CardContent>
        <CardFooter class="flex justify-end border-t p-6">
          <div class="flex gap-5" v-if="acta?.status === 'Pendiente'">
            <Button @click="updateStatus(Status.A)" :disabled="isSubmitting">
              {{ isSubmitting ? "Aprobando..." : "Aprobada" }}
            </Button>
          </div>
          <div v-if="acta?.status === 'Aprobada'">
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
