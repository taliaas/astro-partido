<template>
    <div class="w-80 p-4 space-y-6 bg-background border rounded-lg shadow-sm">
      <!-- Calendar and Events Section -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Calendario y Eventos</h2>
        
        <!-- Calendar Select -->
        <Collapsible>
          <CollapsibleTrigger class="flex items-center w-full justify-between text-sm font-medium">
            Calendario
            <ChevronDownIcon class="h-4 w-4" />
          </CollapsibleTrigger>
            <CollapsibleContent class="space-y-3 pt-3">
              <Calendar v-model="value" :weekday-format="'short'" class="rounded-md border" />
            </CollapsibleContent>
        </Collapsible>

        <!-- Add Event Form -->
        <Collapsible>
          <CollapsibleTrigger class="flex items-center w-full justify-between text-sm font-medium">
            Añadir Evento
            <ChevronDownIcon class="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent class="space-y-3 pt-3">
            <Input 
              v-model="newEvent.title" 
              placeholder="Añadir tarea o evento"
            />
            <Select v-model="newEvent.type" class="w-full">
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tarea">Tarea</SelectItem>
                <SelectItem value="evento">Evento</SelectItem>
              </SelectContent>
            </Select>
            <Button @click="addEvent" class="w-full">Añadir</Button>
          </CollapsibleContent>
        </Collapsible>
  
        <!-- Current Date -->
        <div class="text-sm font-medium">
          {{ currentDate }}
        </div>
        
        <!-- No Events Message -->
        <p class="text-sm text-muted-foreground">
          No hay tareas o eventos para este día.
        </p>
      </div>
  
      <!-- Pending Tasks Section -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Tareas Pendientes</h2>
        <div class="space-y-2">
          <div v-for="task in pendingTasks" :key="task.id" class="flex items-start space-x-2">
            <Checkbox v-model="task.completed" />
            <div class="grid gap-1.5 leading-none">
              <label 
                :for="task.id" 
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {{ task.title }}
              </label>
              <p class="text-sm text-muted-foreground">
                {{ task.dueDate }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts"> 
  import { ref } from 'vue'
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { type Ref } from 'vue'
  import { ChevronDownIcon } from 'lucide-vue-next'
  
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