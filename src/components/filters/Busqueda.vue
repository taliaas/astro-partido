<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { navigate } from "astro:transitions/client";
import { ref } from "vue";

const { actas, limit } = defineProps<{
  actas: any;
  limit: any;
}>();

console.log(actas)
const found = ref(0);
const currentPage = ref(1);
const total = ref(actas?.total);
const currentLimit = ref(limit);
const tableHeaders = [
  "No.",
  "Nombre del acta",
  "Núcleo",
  "Fecha",
  "Estado",
  "Acciones",
];

function goToNextPage() {
  if (actas.total > currentPage.value) {
    currentPage.value++;
    navigate(`/busqueda?page=${currentPage.value}&limit=${limit}`);
  }
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    navigate(`/busqueda??page=${currentPage.value}&limit=${limit}`);
  }
}

</script>

<template>
  <div
    class="min-h-screen bg-linear-to-b from-gray-50 to-white dark:bg-zinc-800"
  >
    <div class="max-w-[1600px] mx-auto p-6">
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div class="p-8">
          <h2 class="font-bold text-3xl">Búsqueda Avanzada</h2>
          <p v-if="found === 0" class="text-md text-gray-500"></p>
          <p v-else-if="found === 1" class="text-md text-gray-500">
            {{ found }} coincidencia encontrada
          </p>
          <p v-else class="text-md text-gray-500">
            {{ found }} coincidencias encontradas
          </p>
        </div>
        <!-- Results -->
        <div class="space-y-6">
          <div
            v-for="acta in actas"
            :key="acta.id"
            class="border-b border-gray-200 pb-6"
          >
            <!-- Title and PDF link -->
            <div class="flex justify-between items-start mb-2">
              <h2
                class="text-xl text-blue-600 hover:underline cursor-pointer font-normal"
              >
                {{ acta.name }}
              </h2>
              <a
                target="_blank"
                class="text-blue-600 hover:underline text-sm font-medium"
              >
                Acta
              </a>
            </div>

            <!-- Metadata -->
            <div class="text-green-700 text-sm mb-2">
              {{ acta.core }}, {{ acta.fecha }}
            </div>

            <!-- Description -->
            <div class="text-gray-700 text-sm mb-3 leading-relaxed">
              {{ acta.text }}
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-4 text-sm">
              <a
                :href='/view/'
                class="text-blue-600 hover:underline font-medium"
              >
                Ver detalles
              </a>
            </div>
          </div>
          <div v-if="actas?.length === 0" class="border border-b-gray-300 p-8">
            No hay coincidencias
            {{actas}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
