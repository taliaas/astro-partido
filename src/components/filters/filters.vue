<script setup lang="ts">
import { Status } from "@/enum/Status.ts";
import { reactive } from "vue";

const { cores } = defineProps<{
  cores: any[],
}>();

const filters = reactive({
  doc_type: '',
  name: '',
  status: '',
  core: '',
  dateFrom: '',
  dateTo: '',
  keywords: ''
})

const statusList = [
  Status.A,
  Status.R,
  Status.I,
  Status.O,
  Status.P
] 

</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Form Content -->
    <form action="/busqueda" method="post" class="px-6 py-2 space-y-6 flex flex-col flex-1">
      <!--Nombre -->
      <div class="space-y-4">
        <label class="text-sm font-medium text-gray-700">Nombre</label>
        <input name="name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nombre" v-model="filters.name"/>
      </div>

      <!-- Tipo de documento -->
      <div class="space-y-4">
        <label class="text-sm font-medium text-gray-700"
          >Tipo de documento</label
        >
        <select
          name="doc_type"
          v-model="filters.doc_type"
          class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="">Todos las actas</option>
          <option value="ro">Ordinaria</option>
          <option value="cp">Círculo Político</option>
        </select>
      </div>

      <!-- Nucleo -->
      <div class="space-y-4">
        <label class="text-sm font-medium text-gray-700">Núcleo</label>
        <select name="core" v-model="filters.core" class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
          <option value="" >Todos los núcleos</option>
          <option v-for="nucleo in cores" :key="nucleo.id" :value="nucleo.name">{{nucleo.name}}</option>
        </select>
      </div>

      <!-- Estado -->
      <div class="space-y-4">
        <label class="text-sm font-medium text-gray-700">Estado</label>
        <select
          name="status"
          v-model="filters.status"
          class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
          <option value="">Todos los estados</option>
          <option v-for="stats in statusList" :value="stats">
            {{stats}}
          </option>
        </select>
      </div>

      <!-- Período -->
      <div class="space-y-4">
        <label class="text-sm font-medium text-gray-700">Período</label>
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-gray-600">Desde</label>
            <div class="relative">
              <input
                name="dateFrom"
                v-model="filters.dateFrom"
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
                v-model="filters.dateTo"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Palabras clave -->
      <div class="space-y-4">
        <label class="text-sm font-medium text-gray-700">Palabras clave</label>
        <input
          name="keywords"
          v-model="filters.keywords"
          type="text"
          placeholder="Ej: guardia, crecimiento, sanción"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-between p-2 pt-4 border-t border-gray-300 mt-auto">
        <button
          type="reset"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Limpiar
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md"
        >
          Aplicar filtros
        </button>
      </div>
    </form>
  </div>
</template>

