<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { indicators } from "@/enum/indicators";
import type { Core } from "@/interface/Militante";
import { reactive } from "vue";

interface CurrentUser {
  roleId: number;
  coreId: number;
  name: string;
}

const { showCoreFilter, currentUser, cores } = defineProps<{
  showCoreFilter: boolean;
  currentUser: CurrentUser | null;
  cores: Core[];
}>();

const filters = reactive({
  core: "",
  doc_type: "",
  indicators: "",
  dateFrom: "",
  dateTo: "",
  text: "",
});

const indicatorsList = [
  indicators.SANCION,
  indicators.TRASLADO,
  indicators.DESACTIVACION,
  indicators.RENDICION_DE_CUENTAS,
  indicators.INVITADOS,
];

const clearFilters = () => {
  filters.core = "";
  filters.doc_type = "";
  filters.indicators = "";
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.text = "";
};
</script>

<template>
  <div class="h-full flex flex-col bg-white border-r shadow-sm pt-12">
    <!-- Form Content -->
    <form
      action="/busqueda"
      method="post"
      class="px-6 py-2 space-y-6 flex flex-col flex-1"
    >
      <!-- Núcleo - Solo visible para Admin y Comité CUJAE -->
      <div v-if="showCoreFilter" class="space-y-4">
        <label class="text-sm font-medium text-gray-700">Núcleo</label>
        <select
          name="core"
          v-model="filters.core"
          class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="">Todos los núcleos</option>
          <option v-for="nucleo in cores" :key="nucleo.id" :value="nucleo">
            {{ nucleo.name }}
          </option>
        </select>
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
          <option value="ro">Reunión Ordinaria</option>
          <option value="cp">Círculo Político</option>
        </select>
      </div>

      <!-- Indicador-->
      <div class="space-y-4">
        <label class="text-sm font-medium text-gray-700">Indicador</label>
        <select
          name="text"
          v-model="filters.text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="">Todos los indicadores</option>
          <option v-for="stats in indicatorsList" :value="stats">
            {{ stats }}
          </option>
        </select>
      </div>

      <!-- Periodo-->
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

      <!-- Footer Buttons -->
      <div
        class="flex justify-between p-2 pt-4 border-t border-gray-300 mt-auto"
      >
        <Button type="button" @click.prevent="clearFilters" variant="outline">
          Limpiar
        </Button>
        <Button type="submit"> Aplicar filtros </Button>
      </div>
    </form>
  </div>
</template>
