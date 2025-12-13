<template>
  <div class="pb-4">
    <h2 class="text-2xl font-bold text-gray-900">Sanciones</h2>
  </div>
  <div class="border shadow-sm bg-white p-6 rounded-2xl">
    <table class="w-full border">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Motivo
          </th>
          <th
            class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Fecha Inicio
          </th>
          <th
            class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Duración
          </th>
          <th
            class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Severidad
          </th>
          <th
            class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Estado
          </th>
          <th
            class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Detalles
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="sanction in sanctions"
          :key="sanction.id"
          class="hover:bg-gray-50"
        >
          <td class="px-6 py-4">
            <div class="text-sm font-semibold text-gray-900 max-w-xs">
              {{ sanction.causa }}
            </div>
          </td>
          <td
            class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
          >
            {{ sanction.fecha }}
          </td>
          <td
            class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
          >
            <div v-if="sanction.duracion > 1">
              {{ sanction.duracion }} meses
            </div>
            <div v-else>{{ sanction.duracion }} mes</div>
          </td>
          <td class="px-6 py-4 text-center whitespace-nowrap">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getColors(sanction.severidad)"
            >
              {{ sanction.severidad }}
            </span>
          </td>
          <td class="px-6 py-4 text-center whitespace-nowrap">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getColorsStatus(sanction.estado)"
            >
              {{ sanction.estado }}
            </span>
          </td>
          <td class="px-6 py-4 text-center whitespace-nowrap">
            {{ sanction.details }}
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="!sanctions?.length"
      class="text-center py-8 text-gray-500 text-lg border"
    >
      No hay sanciones para este militante
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sancion } from "@/interface/Militante";

const { sanctions } = defineProps<{
  sanctions: Sancion[];
}>();

const getColors = (severity: string) => {
  const colors = {
    LEVE: "bg-green-50 text-green-700 border border-green-300",
    MEDIA: "bg-yellow-50 text-yellow-700 border border-yellow-300",
    GRAVE: "bg-red-50 text-red-700 border border-red-300",
  };
  return colors[severity];
};

const getColorsStatus = (estado: string) => {
  const colors = {
    CUMPLIDA: "bg-green-50 text-green-700 border border-green-300",
    APROBADA: "bg-yellow-50 text-yellow-700 border border-yellow-300",
    DENEGADA: "bg-red-50 text-red-700 border border-red-300",
  };
  return colors[estado];
};
</script>
