<template>
    <div class="min-h-screen bg-gray-50 p-6 dark:bg-zinc-800">
      <div class="flex flex-col md:flex-row gap-6 justify-center">
        <!-- Main Table Section -->
        <div class="flex-1 bg-white max-w-5xl rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
           <h2 class="text-lg text-gray-600 ">ASISTENCIA PARA EL CONTROL DE LAS ACTAS</h2>
           <div class="flex items-center space-x-4">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 px-2 py-2">
              <input type="month" class="text-sm focus:outline-none text-gray-900"
            v-model="fecha"/>
            </div>
            <button class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-sm text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
              <DownloadIcon class="w-4 h-4 mr-2" />
              Exportar
            </button>
           </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="header in tableHeaders" :key="header" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, index) in tableData" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ row.nucleo }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ row.fechaReunion }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ row.fechaEntrega }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ row.militantes }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ row.asistencia }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ row.ausentes }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="getPercentageClass(row.porcentaje)">
                      {{ row.porcentaje }}%
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu class="bg-white p-2 rounded-lg shadow-md">
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" class="w-8 h-8 p-0 rounded-full">
                        <MoreVerticalIcon class="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem @click="showAbsenceReasons = true">
                        <Eye class="w-4 h-4" />
                        <span>Causas</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <!-- Side Panel -->
        <div class="w-full max-w-xl space-y-6 ">
          <!-- Absence Reasons Chart -->
          <div class="bg-white rounded-lg shadow-md p-6 dark:bg-zinc-800 dark:border dark:border-gray-400">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Causas de Ausencia</h3>
              <button @click="isChartOpen = !isChartOpen" class="rounded-full hover:bg-gray-100 p-1 text-gray-400 hover:text-gray-500">
                <ChevronDownIcon v-if="!isChartOpen" class="w-5 h-5" />
                <ChevronUpIcon v-else class="w-5 h-5" />
              </button>
            </div>
            
            <div v-show="isChartOpen" class="space-y-4">
              <div v-for="reason in absenceReasons" :key="reason.label" class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-300">{{ reason.label }}</span>
                  <span class="font-medium">{{ reason.count }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    :class="reason.color" 
                    class="rounded-full h-2 transition-all duration-500"
                    :style="{ width: `${reason.percentage}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Notes Section -->
          <div class="bg-white rounded-lg shadow-md p-6 dark:bg-zinc-800 dark:border dark:border-gray-400">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-white ">Análisis de Injustificados</h3>
              <button @click="isNotesOpen = !isNotesOpen"  class="rounded-full hover:bg-gray-100 p-1 text-gray-400 hover:text-gray-500">
                <ChevronDownIcon v-if="!isNotesOpen" class="w-5 h-5" />
                <ChevronUpIcon v-else class="w-5 h-5" />
              </button>
            </div>
            
            <div v-show="isNotesOpen" class="space-y-4 ">
                <div class="space-y-4 max-h-[60vh] overflow-y-auto">
                    <div v-for="note in notes" :key="note.id" class="p-4 rounded bg-blue-100 dark:bg-blue-800">
              <div class="flex justify-between items-start">
                <span class="font-medium">{{ note.area }}</span>
                <span class="text-sm text-gray-500 dark:text-gray-300">{{ note.date }}</span>
              </div>
              <p class="mt-2 text-gray-700 dark:text-gray-200">{{ note.text }}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
    <!-- Absence Reasons Dialog -->
    <Dialog v-model:open="showAbsenceReasons">
        <DialogContent class="bg-white rounded shadow-md ">
          <DialogHeader>
            <DialogTitle>Causas de Ausencias</DialogTitle>
          </DialogHeader>
          <div class="space-y-3 max-h-[60vh] overflow-y-auto">
            <div
              v-for="reason in absenceReasons"
              :key="reason.label"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <div :class="[reason.color, 'w-3 h-3 rounded']"></div>
                <span class="text-sm">{{ reason.label }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm font-medium">{{ reason.count }}</span>
                <div class="w-24 bg-gray-200 rounded h-2">
                  <div
                    :class="[reason.color, 'h-2 rounded']"
                    :style="{ width: `${reason.percentage}%` }"
                  ></div>
                </div>
                
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { ChevronDownIcon, ChevronUpIcon, MoreVerticalIcon, DownloadIcon, Eye } from 'lucide-vue-next'
import DropdownMenu from './ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuTrigger from './ui/dropdown-menu/DropdownMenuTrigger.vue';
import Button from './ui/button/Button.vue';
import DropdownMenuContent from './ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from './ui/dropdown-menu/DropdownMenuItem.vue';
import Dialog from './ui/dialog/Dialog.vue';
import DialogContent from './ui/dialog/DialogContent.vue';
import DialogHeader from './ui/dialog/DialogHeader.vue';
  
  const isChartOpen = ref(false)
  const isNotesOpen = ref(true)
  const showAbsenceReasons = ref(false);
  const fecha = ref("2024-03");

  const absenceReasons = ref([
    { label: "Enfermedad", count: 6, percentage: 30, color: "bg-red-600" },
    { label: "Extranjero", count: 3, percentage: 1, color: "bg-blue-600" },
    { label: "Trabajo", count: 3, percentage: 15, color: "bg-gray-600" },
    { label: "Fuera de Provincia", count: 6, percentage: 30, color: "bg-yellow-400" },
    { label: "Vacaciones", count: 2, percentage: 10, color: "bg-green-600" },
    { label: "Lic. de Maternidad", count: 2, percentage: 1, color: "bg-pink-600" },
    { label: "Problemas Personales", count: 3, percentage: 1, color: "bg-purple-600" },
    { label: "Problemas Familiares", count: 2, percentage: 1, color: "bg-orange-600" },
    { label: "Movilizado", count: 2, percentage: 1, color: "bg-blue-300" },
    { label: "Injustificado", count: 3, percentage: 1, color: "bg-violet-800" },
    { label: "Otros", count: 2, percentage: 1, color: "bg-red-400" },
  ])
  
  const tableHeaders = [
    'Núcleo',
    'Fecha de Reunión',
    'Fecha de Entrega',
    'Militantes',
    'Asistencia',
    'Ausentes',
    'Porcentaje',
    'Acciones'
  ]
  
  const tableData = [
    {
      nucleo: 'Arquitectura',
      fechaReunion: '2024-03-15',
      fechaEntrega: '2024-03-20',
      militantes: 11,
      asistencia: 11,
      ausentes: 0,
      porcentaje: 100
    },
    {
      nucleo: 'Automática',
      fechaReunion: '2024-03-16',
      fechaEntrega: '2024-03-21',
      militantes: 16,
      asistencia: 10,
      ausentes: 6,
      porcentaje: 62.5
    },
    {
      nucleo: 'CIPEL',
      fechaReunion: '2024-03-17',
      fechaEntrega: '2024-03-22',
      militantes: 16,
      asistencia: 0,
      ausentes: 16,
      porcentaje: 0
    }
  ]
  const notes = ref([
  {
    id: 1,
    area: "Automática",
    date: "Mar 24",
    text:
      "Hay 3 procesos de desactivación en curso, 1 en el extranjero en beca doctoral.",
  },
  {
    id: 2,
    area: "CIME",
    date: "Mar 24",
    text:
      "1 con Parkinson enfermo, imposible de asistir. (El Núcleo acordó su flexibilización).",
  },
  {
    id: 3,
    area: "VRIPG",
    date: "Mar 24",
    text: "Revisar trámite de traslado de Modesto.",
  },
]);
  const getPercentageClass = (percentage) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }
  </script>