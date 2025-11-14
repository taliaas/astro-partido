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

      <!-- Add Event Form -->
      <Collapsible default-open v-if="hasPermission('Eventos', 'create')">
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
          <Select v-model="newEvent.type">
            <SelectTrigger class="border-gray-300 rounded w-full">
              <SelectValue placeholder="Tipo" class="text-gray-700" />
            </SelectTrigger>
            <SelectContent class="bg-white">
              <SelectItem class="hover:bg-gray-100" value="Tarea"
                >Tarea
              </SelectItem>
              <SelectItem class="hover:bg-gray-100" value="Evento"
                >Evento
              </SelectItem>
              <SelectItem class="hover:bg-gray-100" value="Reunion"
                >Reunión
              </SelectItem>
              <SelectItem class="hover:bg-gray-100" value="Otro"
                >Otro
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            @click="addEvent"
            :disabled="!currentDate || !newEvent.title || !newEvent.type"
            class="w-full bg-blue-600 text-white rounded"
            >Añadir
          </Button>
        </CollapsibleContent>
      </Collapsible>

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
</template>

<script setup lang="ts">
import { usePermissions } from "@/utils/auth-client";
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { ActionError, actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { ChevronDownIcon } from "lucide-vue-next";
import { onMounted, reactive, ref, type Ref, watch } from "vue";
import { toast } from "vue-sonner";
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

interface EventData {
  id: number;
  type: string;
  title: string;
}

const hasPermission = usePermissions();

const newEvent = reactive({
  title: "",
  type: "",
});

const currentDate = ref(today(getLocalTimeZone())) as Ref<DateValue>;
const pendingTasks = ref<EventData[]>([]);

async function addEvent() {
  const fecha = currentDate.value.toString();
  const { error } = await actions.events.createEvent({
    ...newEvent,
    date: fecha,
  });
  if (error instanceof ActionError) {
    toast.error("Hubo un error al crear el evento");
  } else {
    toast.success("Se creó un evento");
    newEvent.title = "";
    newEvent.type = "";
    navigate("/home");
  }
}

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
