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
        <div class=" shadow-md rounded-md">
          <table class="min-w-full divide-y divide-gray-200 border">
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
        <!-- Empty State -->
        <div v-if="tableData.attendances.length === 0" class="text-center py-12">
          <h3 class="mt-2 text-md font-medium text-gray-900">No hay actas</h3>
          <p class="mt-1 text-md text-gray-500">
            Comienza creando una nueva acta o cargando un documento existente.
          </p>
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
            <div v-if="Object.keys(absenceReasons.reasons).length === 0">
              <p>No hay causas de ausencias</p>
            </div>
            <div class="space-y-4">
              <div v-for="reason in absenceReasons" :key="reason" class="relative">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">{{ reason }}</span>
                  <span class="text-sm font-medium text-gray-500">{{ value }}%</span>
                </div>
                <div class="h-4 w-full bg-blue-100 rounded-full overflow-hidden">
                  <div
                      class="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                      :style="{
              width: `${value}%`,
              boxShadow: 'inset 0 0 0 2px rgba(29, 78, 216, 0.7)' // Darker blue border
            }"></div>
                </div>
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
              <div v-if="Object.keys(notes).length === 0">
                <p>No hay notas</p>
              </div>
              <div v-else v-for="note in notes" :key="note.id" class="p-4 rounded bg-blue-100 dark:bg-blue-800">
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
    <Card class="my-8 w-1/2">
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
        <div v-if="Object.keys(reasonAbsent).length === 0">
          <p>No hay causas de ausencias</p>
        </div>
        <div
            v-else
            v-for="(reason, value) in reasonAbsent"
            :key="value"
            class="flex items-center justify-between"
        >
          <div class="flex items-center space-x-3">
            <span class="text-sm">{{ reason }}</span>
            <p>{{ value }}</p>
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
const fecha = ref("2024-02");
const reasonAbsent = ref('')

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

const notes = ref([]);

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
    console.log(absenceReasons.value)
  } catch (error) {
    console.log(error)
  }
}

async function handleAct(reason: any){
  showAbsenceReasons.value = true
  reasonAbsent.value = reason
}

watch(() => fecha.value, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    getAttendance();
  }
})
</script>