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
          <p class="text-md text-gray-500">No hay tareas o eventos.</p>
        </div>
        <div
          v-else
          class="flex pt-4 bg-white border p-12 rounded gap-2 grid-cols-1"
        >
          <div v-for="ev in event.data" :key="ev.id" class="border-b">
            <p class="text-button px-4 font-medium">{{ ev.type }}</p>
            <div class="flex justify-between">
              <h3 class="py-2">Detalles: {{ ev.title }}</h3>
              <p class="text-gray-400">{{ ev.date }}</p>
            </div>
          </div>
        </div>
        <!-- Pagination -->
        <div v-if="event.data.length === 0" class="flex items-center justify-between py-4">
          <Button
            variant="outline"
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded border bg-white text-gray-700 disabled:opacity-50"
          >
            <ChevronLeft />
          </Button>
          <span class="text-md text-gray-500">
            Página <span class="font-bold">{{ currentPage }}</span> de
            <span class="font-bold">{{ event.totalPages }}</span>
          </span>
          <Button
            variant="outline"
            @click="nextPage"
            :disabled="currentPage <= event.totalPages"
            class="px-4 py-2 rounded border bg-white text-gray-700 disabled:opacity-50"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { navigate } from "astro:transitions/client";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-vue-next";
import { ref } from "vue";

interface EventItem {
  id: number;
  type: string;
  title: string;
  date: Date;
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
