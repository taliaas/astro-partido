<script setup lang="ts">
import { indicators } from "@/enum/indicators.ts";
import { reactive, watch } from "vue";

interface CurrentUser {
  userId: number;    
  roleId: number;     
  coreId?: string;   
  name: string;      
}

const { showCoreFilter, currentUser } = defineProps<{
  showCoreFilter: boolean;
  currentUser: CurrentUser | null;
}>();

const filters = reactive({
  core: '',
  doc_type: '',
  indicators: '',
  dateFrom: '',
  dateTo: '',
  text: '',
})

const indicatorsList = [
  indicators.SANCION,
  indicators.TRASLADO,
  indicators.DESACTIVACION,
  indicators.RENDICION_DE_CUENTAS,
  indicators.INVITADOS,
]

const coresList = [
  'Ing. Industrial',  'Arquitectura',  'Automática',
  'CIPEL',  'CEIS',  'Telecomunicaciones',  'CIME',
  'Rectorado',  'VRD',  'VREAS',  'VREU',  'VRIPG',
  'VRP',  'CEIM-CETER',  'TCM',  'CEMAT',  'CIFQ',
  'DPPD',  'MARXISMO',  'CECAT', 'CIH', 'Geociencias',
  'Química', 
]

// Cargar filtros desde la URL al montar el componente
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  filters.core = urlParams.get('core') || '';
  filters.doc_type = urlParams.get('doc_type') || '';
  filters.text = urlParams.get('text') || '';
  filters.dateFrom = urlParams.get('dateFrom') || '';
  filters.dateTo = urlParams.get('dateTo') || '';
}

// Aplicar filtros automáticamente cuando cambian
function applyFilters() {
  const params = new URLSearchParams();
  
  if (filters.core?.trim()) params.set('core', filters.core.trim());
  if (filters.doc_type?.trim()) params.set('doc_type', filters.doc_type.trim());
  if (filters.text?.trim()) params.set('text', filters.text.trim());
  if (filters.dateFrom?.trim()) params.set('dateFrom', filters.dateFrom.trim());
  if (filters.dateTo?.trim()) params.set('dateTo', filters.dateTo.trim());
  
  params.set('page', '1');
  params.set('limit', '10');
  
  window.location.href = `/busqueda?${params.toString()}`;
}

// Watch para aplicar filtros automáticamente
watch(filters, () => {
  applyFilters();
}, { deep: true });

const clearFilters = () => {
  filters.core = ''
  filters.doc_type = ''
  filters.indicators = ''
  filters.dateFrom = ''
  filters.dateTo = ''
  filters.text = ''
  
  // Redirigir a la página sin filtros
  window.location.href = '/busqueda?page=1&limit=10';
}
</script>

<template>
  <div class="h-full flex flex-col bg-white border-r shadow-sm pt-12">
    <div class="px-6 py-2 space-y-6 flex flex-col flex-1">
      
      <!-- Núcleo - Solo visible para Admin (1) y Comité CUJAE (6) -->
      <div v-if="showCoreFilter" class="space-y-4">
        <label class="text-sm font-medium text-gray-700">Núcleo</label>
        <select v-model="filters.core" class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
          <option value="">Todos los núcleos</option>
          <option v-for="nucleo in coresList" :key="nucleo" :value="nucleo">
            {{ nucleo }}
          </option>
        </select>
      </div>

      <!-- Mensaje informativo para usuarios sin acceso al filtro -->
      <div v-if="!showCoreFilter && currentUser" class="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p class="text-xs text-blue-700">
          Búsqueda limitada a tu núcleo
        </p>
      </div>

      <!-- Tipo de documento -->
      <div class="space-y-4">
        <label class="text-sm font-medium text-gray-700">Tipo de documento</label>
        <select
          v-model="filters.doc_type"
          class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="">Todos las actas</option>
          <option value="ro">Reunión Ordinaria</option>
          <option value="cp">Círculo Político</option>
        </select>
      </div>

      <!-- Indicador -->
      <div class="space-y-4">
        <label class="text-sm font-medium text-gray-700">Indicador</label>
        <select
          v-model="filters.text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
          <option value="">Todos los indicadores</option>
          <option v-for="stats in indicatorsList" :key="stats" :value="stats">
            {{stats}}
          </option>
        </select>
      </div>

      <!-- Periodo -->
      <div class="space-y-4">
        <label class="text-sm font-medium text-gray-700">Período</label>
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-gray-600">Desde</label>
            <div class="relative">
              <input
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
                v-model="filters.dateTo"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div> 

      <!-- Footer Button -->
      <div class="flex justify-center p-2 pt-4 border-t border-gray-300 mt-auto">
        <button
          type="button"
          @click.prevent="clearFilters"
          class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  </div>
</template>