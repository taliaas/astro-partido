<template>
  <div class="w-80 p-4 space-y-8 mt-2.5 bg-white border rounded shadow-md">
    <!-- Calendar and Events Section -->
    <div class="space-y-4">
      <!-- Calendar Select -->
      <Collapsible default-open>
        <CollapsibleTrigger class="flex items-center w-full justify-between text-lg font-medium">
          Calendario
          <ChevronDownIcon class="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent class="space-y-3 pt-3">
          <Calendar v-model="currentDate" :weekday-format="'short'" class="rounded border" />
        </CollapsibleContent>
      </Collapsible>

      <!-- Add Event Form -->
      <Collapsible default-open>
        <CollapsibleTrigger class="flex items-center w-full justify-between text-lg font-medium">
          Añadir Evento
          <ChevronDownIcon class="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent class="space-y-3 p-3">
          <Input v-model="newEvent.title" class="rounded hover:outline-none border-gray-300 text-gray-700"
            placeholder="Añadir tarea o evento" />
          <Select v-model="newEvent.type" class="w-full">
            <SelectTrigger class="border-gray-300 rounded">
              <SelectValue placeholder="Tipo" class="text-gray-700" />
            </SelectTrigger>
            <SelectContent class="bg-white">
              <SelectItem class="hover:bg-gray-100" value="Tarea">Tarea
              </SelectItem>
              <SelectItem class="hover:bg-gray-100" value="Evento">Evento
              </SelectItem>
              <SelectItem class="hover:bg-gray-100" value="Reunion">Reunión
              </SelectItem>
              <SelectItem class="hover:bg-gray-100" value="Otro">Otro
              </SelectItem>
            </SelectContent>
          </Select>
          <Button @click="addEvent" :disabled="!currentDate || !newEvent.title || !newEvent.type"
            class="w-full bg-blue-600 text-white rounded">Añadir
          </Button>

          <!-- No Events Message -->
          <div v-if="pendingTasks.length === 0">
            <p class="text-md text-gray-500">
              No hay tareas o eventos para este día.
            </p>
          </div>

          <div v-else class="border-t">
            <h2 class="font-medium text-lg mt-2">Eventos</h2>
            <div v-for="ev in pendingTasks" :key="ev.id" class="flex">
              <p class="text-button px-4 font-medium">{{ ev.type }}</p>
              <h3>{{ ev.title }}</h3>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>

    <div v-if="notification.show"
      class="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300"
      :class="notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { ChevronDownIcon } from "lucide-vue-next";
import { reactive, ref, type Ref } from "vue";
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

const notification = reactive({
  show: false,
  message: "",
  type: "success",
});

const newEvent = reactive({
  title: "",
  type: "",
});

const currentDate = ref(today(getLocalTimeZone())) as Ref<DateValue>;
const pendingTasks = ref([]);

const showNotification = (message: string, type = "success") => {
  notification.show = true;
  notification.message = message;
  notification.type = type;
  setTimeout(() => {
    notification.show = false;
  }, 3000);
};

async function addEvent() {
  const fecha = currentDate.value.toString()
  try {
    await actions.events.createEvent({ ...newEvent, date: fecha })
    showNotification('Se creó un evento')
    newEvent.title = ""
    newEvent.type = ""
    navigate('/home')
  }
  catch (e) {
    console.error(e)
    throw new Error("Ocurrio un error al crear el evento")
  }
}

async function getAllEvent(date: any) {
  console.log(date)
  try {
    pendingTasks.value = await actions.events.getEvents.orThrow({ date })
    return pendingTasks
  }
  catch (e) {
    console.error(e)
  }
}
getAllEvent(currentDate.value.toString());
</script>
