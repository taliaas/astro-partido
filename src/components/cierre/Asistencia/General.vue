<template>
  <!-- Data Table -->
  <div class="bg-white rounded shadow-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">Total CUJAE</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
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
              Asistencia
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Diferencia
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
              {{ row.mil_infoest }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ row.mil_acta }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ row.asistencia }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ row.diferencia }}
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
    <!-- Notes Section -->
    <div class="bg-white rounded shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Notas y Observaciones</h3>
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
  { label: "Trabajo", count: 3, percentage: 15, color: "bg-blue-600" },
  { label: "Vacaciones", count: 2, percentage: 10, color: "bg-green-600" },
]);

const notes = ref([
  {
    texto: "Resultados satisfactorios.",
    fecha: "Mar 24",
    bgColor: "bg-blue-50",
  },
]);
</script>
