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
            <button
                class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-sm text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
              <DownloadIcon class="w-4 h-4 mr-2"/>
              Exportar
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th v-for="header in tableHeaders" :key="header"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ header }}
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(row, index) in tableData.attendances" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ row.core }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ row.creationDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ row.deliveryDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ row.total }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ row.attendance }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ row.absents }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="getPercentageClass(row.percent)">
                      {{ row.percent }}%
                    </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <DropdownMenu class="bg-white p-2 rounded-lg shadow-md">
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" class="w-8 h-8 p-0 rounded-full">
                      <MoreVerticalIcon class="w-4 h-4"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem @click="handleAct(row.reasons)">
                      <Eye class="w-4 h-4"/>
                      <span>Ver Causas</span>
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
            <button @click="isChartOpen = !isChartOpen"
                    class="rounded-full hover:bg-gray-100 p-1 text-gray-400 hover:text-gray-500">
              <ChevronDownIcon v-if="!isChartOpen" class="w-5 h-5"/>
              <ChevronUpIcon v-else class="w-5 h-5"/>
            </button>
          </div>

          <div v-show="isChartOpen" class="space-y-4">
            <div v-for="(value, reason) in absenceReasons.reasons" :key="reason" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="text-sm">{{ reason }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm font-medium">{{ value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div class="bg-white rounded-lg shadow-md p-6 dark:bg-zinc-800 dark:border dark:border-gray-400">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white ">Análisis de Injustificados</h3>
            <button @click="isNotesOpen = !isNotesOpen"
                    class="rounded-full hover:bg-gray-100 p-1 text-gray-400 hover:text-gray-500">
              <ChevronDownIcon v-if="!isNotesOpen" class="w-5 h-5"/>
              <ChevronUpIcon v-else class="w-5 h-5"/>
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
    <Card class="my-8">
      <CardHeader>
        <CardTitle class="font-normal text-lg">Leyenda</CardTitle>
      </CardHeader>
      <CardContent class="">
        <div class="size-2 rounded-full bg-red-500 inline-block"/>
        <h2 class="text-gray-500 inline"> Alerta </h2>
      </CardContent>
    </Card>
  </div>
  <!-- Absence Reasons Dialog -->
  <Dialog v-model:open="showAbsenceReasons">
    <DialogContent class="bg-white rounded shadow-md ">
      <DialogHeader>
        <DialogTitle>Causas de Ausencias</DialogTitle>
      </DialogHeader>
      <div class="space-y-3 max-h-[60vh] overflow-y-auto">
        <div
            v-for="(value, reason) in absenceReasons.attendances[index].reasons"
            :key="reason"
            class="flex items-center justify-between"
        >
          <div class="flex items-center space-x-3">
            <span class="text-sm">{{ reason }}</span>
            <p>{{value}}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {ChevronDownIcon, ChevronUpIcon, MoreVerticalIcon, DownloadIcon, Eye} from 'lucide-vue-next'
import {Button} from '../ui/button';
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from '../ui/dropdown-menu'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '../ui/dialog';
import AbsentService from "@/services/AbsentService.ts";
import type {AttendanceResponse} from "@/interface/Absent.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {bgBlue, bgRed} from "kolorist";

const isChartOpen = ref(false)
const isNotesOpen = ref(true)
const showAbsenceReasons = ref(false);
const fecha = ref("");
const index = ref('')

const absenceReasons =ref<AttendanceResponse>({attendances: undefined, reasons: {}})

const tableHeaders = [
  'Núcleo',
  'Fecha',
  'Entrega',
  'Total',
  'Presentes',
  'Ausentes',
  'Porciento'
]

const tableData = ref<AttendanceResponse>({attendances: [], reasons: undefined})

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

async function getAttendance() {
  const service = new AbsentService()
  const value = fecha.value;
  const [year, month] = value.split('-');
  try {
    const response = await service.getByDate(month, year)
    tableData.value = response
    absenceReasons.value = response
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

async function handleAct(reason: any){
  showAbsenceReasons.value = true
  index.value = reason
}
watch(() => fecha.value, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    getAttendance();
  }
})
</script>