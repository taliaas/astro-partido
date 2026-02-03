<template>
  <div class="w-80 p-4 space-y-8 mt-2.5 bg-white border rounded shadow-md">
    <!-- Calendar and Events Section -->
    <div class="space-y-4">
      <!-- Calendar Select -->
      <Collapsible default-open>
        <CollapsibleTrigger
          class="flex items-center w-full justify-between text-lg font-medium"
        >
          Calendario
          <ChevronDownIcon class="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent class="space-y-3 pt-3">
          <Calendar
            v-model="currentDate"
            :weekday-format="'short'"
            class="rounded border"
          />
        </CollapsibleContent>
      </Collapsible>

      <Button @click="eventOpen = true" class="w-full">Añadir evento</Button>

      <!-- No Events Message -->
      <div v-if="pendingTasks.length === 0">
        <p class="text-md text-gray-500">
          No hay tareas o eventos para este día.
        </p>
      </div>

      <div v-else class="border-t">
        <h2 class="font-medium text-lg mt-2">Eventos</h2>
        <div v-for="ev in pendingTasks" :key="ev.id" class="flex pt-2">
          <p class="text-button px-4 font-medium">{{ ev.type }}</p>
          <h3>{{ ev.title }}</h3>
        </div>
      </div>
    </div>
  </div>
  <EventDialog :users v-model:open="eventOpen" />
</template>

<script setup lang="ts">
import EventDialog from "@/components/Event/EventDialog.vue";
import { Button } from "@/components/ui/button";
import type { User } from "@/interface/Militante";
import { usePermissions } from "@/utils/auth-client";
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { actions } from "astro:actions";
import { ChevronDownIcon } from "lucide-vue-next";
import { onMounted, ref, type Ref, watch } from "vue";
import Calendar from "../ui/calendar/Calendar.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface EventData {
  id: number;
  type: string;
  title: string;
}

const { users } = defineProps<{
  users: User[];
}>();

const eventOpen = ref(false);

const hasPermission = usePermissions();

const currentDate = ref(today(getLocalTimeZone())) as Ref<DateValue>;
const pendingTasks = ref<EventData[]>([]);

async function getAllEvent(date: any) {
  try {
    pendingTasks.value = await actions.events.getEvents.orThrow({ date });
    return pendingTasks;
  } catch (e) {
    console.error(e);
  }
}

onMounted(() => getAllEvent(currentDate.value.toString()));

watch(currentDate, (newDate) => {
  getAllEvent(newDate.toString());
});
</script>
