<template>
  <!-- Data Table -->
  <div class="bg-white rounded shadow-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">Cómite PCC CUJAE</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Fecha de Reunión
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Fecha de Entrega
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Militantes INFOEST
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Militantes por Acta
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Diferencia
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Asistencia
            </th>

            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Porciento %
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(row, index) in tableData" :key="index" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ row.fecha }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ row.entrega }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ row.mil_infoest }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ row.mil_acta }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ row.diferencia }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ row.asistencia }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ row.porcentaje }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Absence Reasons -->
  <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-1">
    <div class="bg-white rounded shadow-lg p-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-900">Causas de las Ausencias</h3>
      <div class="w-3/4 space-y-4 p-3">
        <div
          v-for="(reason, index) in absenceReasons"
          :key="index"
          class="flex items-center"
        >
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              :class="reason.color"
              class="h-2.5 rounded-full"
              :style="{ width: reason.percentage + '%' }"
            ></div>
          </div>
          <span class="ml-4 min-w-[100px] text-sm text-gray-600">
            {{ reason.label }}: {{ reason.count }}
          </span>
        </div>
      </div>
    </div>
    <!-- Notes Section -->
    <div class="bg-white rounded shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Análisis de Injustificados</h3>
      <div class="space-y-4">
        <div
          v-for="(note, index) in notes"
          :key="index"
          class="p-4 rounded-lg"
          :class="note.bgColor"
        >
          <p class="text-sm text-gray-800">{{ note.texto }}</p>
          <div class="mt-2 flex items-center text-xs text-gray-600">
            <span class="font-medium">{{ note.nucleo }}</span>
            <span class="mx-2">•</span>
            <span>{{ note.fecha }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const tableData = ref([
  {
    fecha: "2-marzo",
    entrega: "4-marzo",
    mil_infoest: 11,
    mil_acta: 11,
    total: 12,
    asistencia: 10,
    diferencia: 0,
    porcentaje: 90.91,
  },
]);

const absenceReasons = ref([
  { label: "Enfermedad", count: 6, percentage: 30, color: "bg-red-600" },
  { label: "Exterior", count: 3, percentage: 1, color: "bg-blue-600" },
  { label: "Trabajo", count: 3, percentage: 15, color: "bg-gray-600" },
  { label: "F/P", count: 6, percentage: 30, color: "bg-yellow-400" },
  { label: "Vacaciones", count: 2, percentage: 10, color: "bg-green-600" },
  { label: "L/M", count: 2, percentage: 1, color: "bg-pink-600" },
  { label: "P/P", count: 3, percentage: 1, color: "bg-purple-600" },
  { label: "P/F", count: 2, percentage: 1, color: "bg-orange-600" },
  { label: "Mov", count: 2, percentage: 1, color: "bg-blue-300" },
  { label: "Inj", count: 3, percentage: 1, color: "bg-violet-800" },
  { label: "Otros", count: 2, percentage: 1, color: "bg-red-400" },
]);

const notes = ref([
  {
    texto: "Resultados satisfactorios.",
    fecha: "Mar 24",
    bgColor: "bg-blue-50",
  },
]);
</script>
