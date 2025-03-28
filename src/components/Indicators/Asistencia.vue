<template>
  <div
      class="flex justify-between"
      v-if="selectedIndicator === 'asistencia'"
  >
    <!--Asistencia -->
    <div class="w-full">
      <table class="p-2 w-full border border-gray-300">
        <table-header
            class="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
        >
          <tr>
            <th
                class="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Núcleo
            </th>
            <th
                class="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Fecha reunión
            </th>
            <th
                class="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Fecha entrega
            </th>
            <th
                class="px-2 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Total
            </th>
            <th
                class="px-2 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Asistencia
            </th>
            <th
                class="px-2 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Ausente
            </th>
            <th
                class="px-2 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Porciento
            </th>
          </tr>
        </table-header>

        <tbody>
        <tr
            v-for="asis in attendance.attendances"
            :key="asis"
            class="hover:bg-gray-50/50 transition-colors duration-200"
        >
          <th class="p-2 text-left font-normal px-4">
            {{ asis.core }}
          </th>
          <th class="p-2 text-left font-normal px-4">
            {{ asis.creationDate }}
          </th>
          <th class="p-2 text-left font-normal px-4">
            {{ asis.deliveryDate }}
          </th>
          <th class="p-2 text-center font-normal px-4">
            {{ asis.total }}
          </th>
          <th class="p-2 text-center font-normal">
            {{ asis.attendance }}
          </th>
          <th class="p-2 text-center font-normal">
            {{ asis.absents }}
          </th>
          <th class="p-2 text-center font-normal px-4">
            {{ asis.percent }}%
          </th>
        </tr>
        </tbody>
      </table>
      <div
          v-if="attendance.attendances.length === 0"
          class="p-4 border border-gray-300 text-md flex flex-col items-center justify-center"
      >
        <ClipboardIcon class="h-8 w-8 text-gray-400" />
        <h2 class="text-gray-500 font-medium">No hay asistencias</h2>
        <p class="text-gray-400">
          Los datos aparecerán aquí cuando estén disponibles
        </p>
      </div>
    </div>
  </div>
  <!-- Reason - Table Container with Horizontal Scroll -->
  <div
      v-else-if="selectedIndicator === 'reason'"
      class="w-full overflow-x-auto"
  >
    <table class="w-full min-w-[1200px]">
      <thead class="bg-gray-50 sticky top-0 border border-gray-300">
      <tr>
        <th
            v-for="header in headers"
            :key="header.id"
            class="p-3 text-md font-medium text-gray-700 hover:bg-gray-100"
        >
          {{ header.name }}
        </th>
      </tr>
      </thead>
      <tbody>
      <template v-if="attendance.reasons.length">
        <tr
            v-for="(row, index) in attendance.reasons"
            :key="index"
            class="hover:bg-gray-50 transition-colors"
        >
          <td
              v-for="header in headers"
              :key="header.id"
              class="p-3 text-sm text-center border-b first:pl-4 last:pr-4"
          >
            {{ row || "—" }}
          </td>
        </tr>
      </template>

      <!-- Empty State -->
      <tr v-else>
        <td :colspan="headers.length" class="text-center">
          <div
              class="flex flex-col items-center justify-center border border-gray-300 p-4"
          >
            <ClipboardIcon class="h-8 w-8 text-gray-400" />
            <p class="text-gray-500 text-md">
              No hay causas de ausencias
            </p>
            <p class="text-gray-400 text-sm">
              Los datos aparecerán aquí cuando estén disponibles
            </p>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup lang="ts">
import {ClipboardIcon} from "lucide-vue-next";
import {Table, TableHeader} from "@/components/ui/table";

const headers = [
  { id: 1, name: "Núcleo" },
  { id: 2, name: "Enfermedad" },
  { id: 3, name: "Extranjero" },
  { id: 4, name: "Trabajo" },
  { id: 5, name: "Fuera de Provincia" },
  { id: 6, name: "Vacaciones" },
  { id: 7, name: "Lic. de Maternidad" },
  { id: 8, name: "Problemas Personales" },
  { id: 9, name: "Problemas Familiares" },
  { id: 10, name: "Movilizado" },
  { id: 11, name: "Injustificado" },
  { id: 12, name: "Otros" },
];

</script>


