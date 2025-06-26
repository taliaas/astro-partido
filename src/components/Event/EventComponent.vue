<template>
  <div class="min-h-screen mt-4 rounded-xl p-4 bg-gray-50">
    <div class="container mx-auto">
      <div class="p-2">
        <div class="py-6">
          <h2 class="font-bold text-2xl mt-2">Eventos</h2>
          <p class="text-muted-foreground font-medium">
            Gestiona y visualiza todos tus eventos programados
          </p>
        </div>

        <div
          v-if="event.data.length === 0"
          class="p-28 flex flex-col items-center gap-2 border rounded-md bg-white"
        >
          <CalendarIcon class="size-10 text-muted-foreground" />
          <p class="text-md text-gray-500">
            No hay tareas o eventos.
          </p>
        </div>
        <div v-else v-for="ev in event.data" :key="ev.id" class="flex pt-2 bg-white border p-12 rounded">
          <p class="text-button px-4 font-medium">{{ ev.type }}</p>
          <h3>{{ ev.title }}</h3>
        </div>
        <!-- Pagination -->
        <div class="flex items-center justify-between py-4">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded border bg-white text-gray-700 disabled:opacity-50"
          >
            Anterior
          </button>
          <span class="text-md text-gray-500">
            Página <span class="font-bold">{{ currentPage }}</span> de
            <span class="font-bold">{{ event.totalPages }}</span>
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === event.totalPages"
            class="px-4 py-2 rounded border bg-white text-gray-700 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigate } from "astro:transitions/client";
import { CalendarIcon } from "lucide-vue-next";
import { ref } from "vue";

interface EventItem {
  id: number;
  type: string;
  title: string;
}

const { event, page } = defineProps<{
  event: any;
  page: number;
}>();

const currentPage = ref(page || 1);

function nextPage() {
  if (currentPage.value < event.value.totalPages) {
    currentPage.value++;
    navigate(`/events?page=${currentPage.value}`);
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    navigate(`/events?page=${currentPage.value}`);
  }
}
</script>
