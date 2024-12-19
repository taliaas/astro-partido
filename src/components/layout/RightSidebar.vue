<template>
    <div class="w-80 p-4 space-y-6 bg-white border rounded shadow-md">
      <!-- Calendar and Events Section -->
      <div class="space-y-4 ">
        <h2 class="text-2xl font-semibold">Calendario y Eventos</h2>
        
        <!-- Calendar Select -->
        <Collapsible>
          <CollapsibleTrigger class="flex items-center w-full justify-between text-lg font-medium">
            Calendario
            <ChevronDownIcon class="h-4 w-4" />
          </CollapsibleTrigger>
            <CollapsibleContent class="space-y-3 pt-3">
              <Calendar v-model="value" :weekday-format="'short'" class="rounded border" />
            </CollapsibleContent>
        </Collapsible>

        <!-- Add Event Form -->
        <Collapsible>
          <CollapsibleTrigger class="flex items-center w-full justify-between text-lg font-medium">
            Añadir Evento
            <ChevronDownIcon class="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent class="space-y-3 pt-3">
            <Input 
              v-model="newEvent.title" class="rounded border-gray-300 text-gray-700"
              placeholder="Añadir tarea o evento"
            />
            <Select v-model="newEvent.type" class="w-full">
              <SelectTrigger class="border-gray-300 rounded">
                <SelectValue placeholder="Tipo" class="text-gray-700 "/>
              </SelectTrigger>
              <SelectContent class="bg-white">
                <SelectItem class="hover:bg-gray-100" value="tarea">Tarea</SelectItem>
                <SelectItem class="hover:bg-gray-100" value="evento">Evento</SelectItem>
              </SelectContent>
            </Select>
            <Button @click="addEvent" class="w-full bg-blue-600 text-white rounded">Añadir</Button>
          </CollapsibleContent>
        </Collapsible>
  
        <!-- Current Date -->
        <div class="text-sm mt-4 font-medium">
          {{ currentDate }}
        </div>
        
        <!-- No Events Message -->
        <p class="text-md text-gray-500">
          No hay tareas o eventos para este día.
        </p>
      </div>
    </div>
    <div class="w-80 p-4 space-y-6 bg-white border rounded shadow-md">
      <!-- Pending Tasks Section -->
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Tareas Pendientes</h2>
        <div class="space-y-2">
          <div v-for="task in pendingTasks" :key="task.id" class="flex items-start space-x-2">
            <input type="checkbox" v-model="task.completed" class="rounded border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600" />
            <div class="grid gap-1.5 leading-none">
              <label 
                :for="task.id" 
                class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {{ task.title }}
              </label>
              <p class="text-sm text-gray-500">
                {{ task.dueDate }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts"> 
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';
import { ChevronDownIcon } from 'lucide-vue-next';
import { ref, type Ref } from 'vue';
import Button from '../ui/button/Button.vue';
import Calendar from '../ui/calendar/Calendar.vue';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import Input from '../ui/input/Input.vue';
import Select from '../ui/select/Select.vue';
import SelectContent from '../ui/select/SelectContent.vue';
import SelectItem from '../ui/select/SelectItem.vue';
import SelectTrigger from '../ui/select/SelectTrigger.vue';
import SelectValue from '../ui/select/SelectValue.vue';
  
  const newEvent = ref({
    title: '',
    type: ''
  })
  
  const currentDate = ref('18 de diciembre, 2024')
  
  const pendingTasks = ref([
    {
      id: '1',
      title: 'Revisar documentación',
      dueDate: 'Hoy',
      completed: false
    },
    {
      id: '2',
      title: 'Actualizar registros',
      dueDate: 'Mañana',
      completed: false
    },
    {
      id: '3',
      title: 'Preparar informe',
      dueDate: 'En 2 días',
      completed: false
    }
  ])
  
  const addEvent = () => {
    // Add event logic here
    newEvent.value = {
      title: '',
      type: ''
    }
  }
const value = ref(today(getLocalTimeZone())) as Ref<DateValue>
  </script>