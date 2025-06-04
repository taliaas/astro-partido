<script setup lang="ts">
import { ref } from "vue";

// Reactive data
const documentType = ref("todos");
const status = ref("cualquier");
const dateFrom = ref("");
const dateTo = ref("");
const keywords = ref("");
</script>

<template>
  <div class="h-full">
    <!-- Form Content -->
    <form action="/minutes" method="post" class="p-2 space-y-6">
      <!-- Tipo de documento -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700"
          >Tipo de documento</label
        >
        <select
          name="documentType"
          v-model="documentType"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="todos">Todos las actas</option>
          <option value="ro">Ordinaria</option>
          <option value="cp">Círculo Político</option>
        </select>
      </div>

      <!-- Estado -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Estado</label>
        <select
          name="status"
          v-model="status"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="cualquier">Cualquier estado</option>
          <option value="activo">Activo</option>
        </select>
      </div>

      <!-- Período -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Período</label>
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-gray-600">Desde</label>
            <div class="relative">
              <input
                name="dateFrom"
                v-model="dateFrom"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-gray-600">Hasta</label>
            <div class="relative">
              <input
                name="dateTo"
                v-model="dateTo"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Palabras clave -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Palabras clave</label>
        <input
          name="keywords"
          v-model="keywords"
          type="text"
          placeholder="Ej: guardia, crecimiento, sanción"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-between p-4 border-t border-gray-200 bg-gray-50">
        <Button
          variant="secondary"
          type="reset"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Limpiar
        </Button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Aplicar filtros
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
