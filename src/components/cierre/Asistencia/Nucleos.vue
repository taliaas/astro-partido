<template>
  <!-- Data Table -->
  <div class="bg-white rounded shadow-lg overflow-hidden">
    
    <div class="flex px-4 py-5 sm:px-6 bg-gray-50 border-gray-200">
    <h2 class="p-3 font-semibold text-gray-900 ">Núcleos</h2>
      <select
        v-model="nucleoSeleccionado"
        class="p-3 font-semibold text-gray-900 border-none rounded"
      >
        <option value="ind">Independientes</option>
        <option value="semestral">Mecánica</option>
        <option value="anual">ICB</option>
        <option value="anual">Civil</option>
        <option value="anual">Mixtos</option>
      </select>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Áreas
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
              Porciento 
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            ></th>
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
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-gray-400 hover:text-gray-500">
                <MoreVerticalIcon class="h-5 w-5" />
              </button>
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
import { MoreVerticalIcon } from "lucide-vue-next";

const tableData = ref([
  {
    nucleo: "Arquitectura",
    fecha: "-",
    entrega: "-",
    mil_infoest: 11,
    mil_acta: 11,
    total: 12,
    asistencia: 0,
    diferencia: 12,
    porcentaje: 0,
  },
  {
    nucleo: "Automática",
    fecha: "7-mar",
    entrega: "8-marz",
    total: 16,
    asistencia: 10,
    diferencia: 6,
    porcentaje: 62.5,
  },
  {
    nucleo: "CIPEL",
    fecha: "-",
    entrega: "-",
    total: 16,
    asistencia: 0,
    diferencia: 16,
    porcentaje: 0,
  },
]);

const nucleoSeleccionado = ref("ind");

const absenceReasons = ref([
  { label: "Enfermedad", count: 6, percentage: 30, color: "bg-red-600" },
  { label: "Trabajo", count: 3, percentage: 15, color: "bg-blue-600" },
  { label: "Vacaciones", count: 2, percentage: 10, color: "bg-green-600" },
]);

const notes = ref([
  {
    texto:
      "Hay 3 procesos de desactivación en curso, 1 en el extranjero en beca doctoral.",
    nucleo: "Automática",
    fecha: "Mar 24",
    bgColor: "bg-blue-50",
  },
  {
    texto:
      "1 con Parkinson enfermo, imposible de asistir. (El Núcleo acordó su flexibilización).",
    nucleo: "CIME",
    fecha: "Mar 24",
    bgColor: "bg-yellow-50",
  },
  {
    texto: "Revisar trámite de traslado de Modesto.",
    nucleo: "VRIPG",
    fecha: "Mar 24",
    bgColor: "bg-green-50",
  },
]);
</script>
