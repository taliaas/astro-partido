<script setup lang="ts">
import { format } from "date-fns";
import { navigate } from "astro:transitions/client";
import { ArrowLeft, ArrowRight } from "lucide-vue-next";
import { ref } from "vue";

const { actas, limit, page } = defineProps<{
  actas: any;
  limit: any;
  page: any;
}>();

const found = ref(actas.numFound);
const currentPage = ref(page);
const total = ref(actas?.total);

function goToNextPage() {
  if (actas.total > currentPage.value) {
    currentPage.value++;
    navigate(`/busqueda?page=${currentPage.value}&limit=${limit}`);
  }
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    navigate(`/busqueda?page=${currentPage.value}&limit=${limit}`);
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
        <div class="p-8 border-b">
          <h2 class="font-bold text-3xl">Resultado de la búsqueda</h2>
          <p v-if="found === 0" class="text-md text-gray-500"></p>
          <p v-else-if="found === 1" class="text-md text-gray-500">
            {{ found }} coincidencia encontrada
          </p>
          <p v-else class="text-md text-gray-500">
            {{ found }} coincidencias encontradas
          </p>
        </div>

        <!-- Results -->
        <div class="space-y-4">
          <div
            v-for="acta in actas.docs"
            :key="acta.id"
            class="p-6 border-b border-gray-200 pb-6"
          >
            <!-- Title and PDF link -->
            <div class="flex justify-between items-start mb-2">
              <a target="_blank"
                class="text-xl font-normal"
              >
                {{ acta.name }}
            </a>
              
            </div>

            <!-- Metadata -->
            <div class="text-green-700 text-sm mb-2">
              {{ acta.core }}, {{ format(acta.creation_date, 'yyyy-MM-dd') }}
            </div>

            <!-- Description -->
            <div class="text-gray-700 text-sm mb-3 leading-relaxed">
              {{ acta.text  || 'actas' }}
            </div>
          </div>
          <div v-if="actas?.length === 0" class="border border-b-gray-300 p-8">
            No hay coincidencias
            {{actas}}
          </div>

        </div>

        <div class="flex justify-between">
          <div class="p-4 text-muted-foreground">
            Mostrando {{page}} de {{limit}}
          </div>
          <div class="space-x-4 p-4 flex justify-end">
            <button @click="goToPreviousPage" type="button" class="flex gap-2 border rounded text-sm font-medium px-4 py-2 mr-4 ">
              <ArrowLeft class="w-4 h-4" />
            </button>
            <button @click="goToNextPage" type="button" class="flex gap-2 rounded border text-sm font-medium px-4 py-2 mr-4 ">
              <ArrowRight class="w-4 h-4"/>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
