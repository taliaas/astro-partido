<template>
  <!-- Summary Cards -->
  <div class="w-full">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
      <div class="bg-white rounded shadow-lg p-6 border-t-4 border-gray-800">
        <h3 class="text-lg font-semibold mb-2 text-gray-900">Núcleos Activos</h3>
        <p class="text-3xl font-bold text-gray-900">15</p>
      </div>
      <div class="bg-white rounded shadow-xl p-6 border-t-4 border-blue-600">
        <h3 class="text-lg font-semibold mb-2">Total Militantes </h3>
        <p class="text-3xl font-bold">277</p>
      </div>
      <div class="bg-white rounded shadow-lg p-6 border-t-4 border-green-600">
        <h3 class="text-lg font-semibold mb-2">Asistencia</h3>
        <p class="text-3xl font-bold">148</p>
      </div>
      <div class="bg-white rounded shadow-lg p-6 border-t-4 border-red-600">
        <h3 class="text-lg font-semibold mb-2">Ausencias</h3>
        <p class="text-3xl font-bold">18</p>
      </div>
      <div class="bg-white rounded shadow-lg p-6 border-t-4 border-yellow-400">
        <h3 class="text-lg font-semibold mb-2 text-gray-900">Porciento%</h3>
        <p class="text-3xl font-bold text-gray-900">19</p>
      </div>
      
    </div>
  </div>


  <!-- Absence Reasons -->
  <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-1">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-900">Análisis de Injustificados</h3>
      <div class="space-y-4">
        <div
          v-for="(reason, index) in absenceReasons"
          :key="index"
          class="flex items-center"
        >
          <div class="w-3/4 bg-gray-200 rounded-full h-2.5">
            <div
              :class="reason.color"
              class="h-2.5 rounded-full"
              :style="{ width: reason.percentage + '%' }"
            ></div>
          </div>
          <span class="ml-4 min-w-[100px] text-md font-medium text-gray-600">
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
  { label: "Exterior", count: 0, percentage: 1, color: "bg-blue-600" },
  { label: "Trabajo", count: 3, percentage: 15, color: "bg-gray-600" },
  { label: "F/P", count: 6, percentage: 30, color: "bg-yellow-400" },
  { label: "Vacaciones", count: 2, percentage: 10, color: "bg-green-600" },
  { label: "L/M", count: 0, percentage: 1, color: "bg-pink-600" },
  { label: "P/P", count: 0, percentage: 1, color: "bg-purple-600" },
  { label: "P/F", count: 0, percentage: 1, color: "bg-orange-600" },
  { label: "Mov", count: 0, percentage: 1, color: "bg-blue-300" },
  { label: "Inj", count: 0, percentage: 1, color: "bg-violet-800" },
  { label: "Otros", count: 0, percentage: 1, color: "bg-red-400" },
]);

const notes = ref([
  {
    texto: "Resultados satisfactorios.",
    fecha: "Mar 24",
    bgColor: "bg-blue-50",
  },
]);
</script>
