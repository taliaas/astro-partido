<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900">COMITÉ DEL PCC CUJAE</h1>
        <p class="text-sm text-gray-500">Marzo 2024</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div class="bg-blue-600 rounded shadow-lg p-6 text-white">
          <h3 class="text-lg font-semibold mb-2">Total Militantes</h3>
          <p class="text-3xl font-bold">277</p>
        </div>
        <div class="bg-green-600 rounded shadow-lg p-6 text-white">
          <h3 class="text-lg font-semibold mb-2">Asistencia</h3>
          <p class="text-3xl font-bold">14.80%</p>
        </div>
        <div class="bg-red-600 rounded shadow-lg p-6 text-white">
          <h3 class="text-lg font-semibold mb-2">Ausencias</h3>
          <p class="text-3xl font-bold">18</p>
        </div>
        <div class="bg-yellow-300 rounded shadow-lg p-6">
          <h3 class="text-lg font-semibold mb-2 text-gray-900">Núcleos Activos</h3>
          <p class="text-3xl font-bold text-gray-900">15</p>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Núcleos Independientes</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Núcleos
                </th>
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
                  Total Militantes
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Asistencia
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ausentes
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
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ row.nucleo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ row.fecha }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ row.entrega }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ row.total }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ row.asistencia }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ row.ausentes }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        class="bg-blue-600 h-2.5 rounded-full"
                        :style="{ width: row.porcentaje + '%' }"
                      ></div>
                    </div>
                    {{ row.porcentaje }}%
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Absence Reasons -->
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">
            Causas de las Ausencias
          </h3>
          <div class="space-y-4">
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
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Notas y Observaciones</h3>
          <div class="space-y-2">
            <div v-for="(note, index) in notes" :key="index" class="flex items-start">
              <div class="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-600"></div>
              <p class="ml-3 text-sm text-gray-600">{{ note }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

const tableData = ref([
  { nucleo: "Arquitectura", fecha: "-", entrega:"-", total: 12, asistencia: 0, ausentes: 12, porcentaje: 0 },
  { nucleo: "Automática", fecha: "7-mar",entrega:"8-marz", total: 16, asistencia: 10,ausentes: 6, porcentaje: 62.5 },
  { nucleo: "CIPEL", fecha: "-",entrega:"-", total: 16, asistencia: 0,ausentes: 16, porcentaje: 0 },
  // Add more rows as needed
]);

const absenceReasons = ref([
  { label: "Enfermedad", count: 6, percentage: 30, color: "bg-red-600" },
  { label: "Trabajo", count: 3, percentage: 15, color: "bg-blue-600" },
  { label: "Vacaciones", count: 2, percentage: 10, color: "bg-green-600" },
]);

const notes = ref([
  "Hay 3 procesos de desactivación en curso, 1 en el extranjero en beca doctoral",
  "1 con Parkinson enfermo, imposible de asistir. (El Núcleo acordó su flexibilización)",
  "**Revisar trámite de traslado de Modesto",
]);
</script>
