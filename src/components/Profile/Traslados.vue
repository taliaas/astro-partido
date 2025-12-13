<template>
  <div class="pb-4">
    <h2 class="text-2xl font-bold text-gray-900">Traslados</h2>
  </div>
  <div class="border shadow-sm bg-white p-6 rounded-2xl">
    <table class="w-full">
      <thead class="bg-gray-50 border">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Origen
          </th>
          <th
            class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Destino
          </th>
          <th
            class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Fecha
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
      <tbody class="bg-white divide-y divide-gray-200 border">
        <tr
          v-for="traslado in transfer"
          :key="traslado.id"
          class="hover:bg-gray-50"
        >
          <td class="px-6 py-4">
            {{ traslado.origen }}
          </td>
          <td class="px-6 py-4 text-center">
            {{ traslado.destino }}
          </td>
          <td
            class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
          >
            {{ traslado.fecha }}
          </td>

          <td class="px-6 py-4 text-center whitespace-nowrap">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="[
                traslado.estado
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-300'
                  : 'bg-green-50 text-green-700 border border-green-300',
              ]"
            >
              {{ traslado.estado ? "Pendiente" : "Completado" }}
            </span>
          </td>
          <td class="px-6 py-4 text-center whitespace-nowrap">
            {{ traslado.details }}
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="!transfer?.length"
      class="text-center py-8 text-gray-500 text-lg border"
    >
      No hay traslados para este militante
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transfer } from "@/interface/Militante";

const { transfer } = defineProps<{
  transfer: Transfer[];
}>();
</script>
