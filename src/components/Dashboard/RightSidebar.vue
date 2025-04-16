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
            v-model="value"
            :weekday-format="'short'"
            class="rounded border"
          />
        </CollapsibleContent>
      </Collapsible>

      <!-- Add Event Form -->
      <Collapsible default-open>
        <CollapsibleTrigger
          class="flex items-center w-full justify-between text-lg font-medium"
        >
          Añadir Evento
          <ChevronDownIcon class="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent class="space-y-3 p-3">
          <Input
            v-model="newEvent.title"
            class="rounded hover:outline-none border-gray-300 text-gray-700"
            placeholder="Añadir tarea o evento"
          />
          <Select v-model="newEvent.type" class="w-full">
            <SelectTrigger class="border-gray-300 rounded">
              <SelectValue placeholder="Tipo" class="text-gray-700" />
            </SelectTrigger>
            <SelectContent class="bg-white">
              <SelectItem class="hover:bg-gray-100" value="tarea"
                >Tarea
              </SelectItem>
              <SelectItem class="hover:bg-gray-100" value="evento"
                >Evento
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            @click="addEvent"
            class="w-full bg-blue-600 text-white rounded"
            >Añadir
          </Button>

          <!-- No Events Message -->
          <div v-if="pendingTasks.length === 0">
            <p class="text-md text-gray-500">
              No hay tareas o eventos para este día.
            </p>
          </div>

          <div v-else class="border-t">
            <h2 class="font-medium text-lg mt-2">Eventos</h2>
            <div v-for="ev in pendingTasks" :key="ev.id">
              <h3>{{ ev.title }}</h3>
              <p>{{ ev.dueDate }}</p>
              <p v-if="ev.completed" class="bg-accent">{{ Listo }}</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { ChevronDownIcon } from "lucide-vue-next";
import { ref, type Ref } from "vue";
import Button from "../ui/button/Button.vue";
import Calendar from "../ui/calendar/Calendar.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Input from "../ui/input/Input.vue";
import Select from "../ui/select/Select.vue";
import SelectContent from "../ui/select/SelectContent.vue";
import SelectItem from "../ui/select/SelectItem.vue";
import SelectTrigger from "../ui/select/SelectTrigger.vue";
import SelectValue from "../ui/select/SelectValue.vue";

const newEvent = ref({
  title: "",
  type: "",
});

interface DataPending {
  id: number;
  title: string;
  dueDate: Date;
  completed: boolean;
}

const pendingTasks: DataPending = ref([]);

const addEvent = () => {
  // Add event logic here
  newEvent.value = {
    title: "",
    type: "",
  };
};
const value = ref(today(getLocalTimeZone())) as Ref<DateValue>;
</script>
