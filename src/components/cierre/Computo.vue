<template>
  <div class="min-h-screen p-8 dark:bg-zinc-800">
      <!-- Header -->
      <div class="bg-white rounded shadow-md container mx-auto">
        <div class="p-8  space-y-6">
        <div class="space-y-2">
        <div class="flex justify-between items-center">
          <h2 class="text-lg text-gray-600">CÓMPUTO PARA EL CONTROL DE LAS ACTAS</h2>
          <!-- Month Selector -->
          <div class="flex items-center space-x-4">
            <input type="month"
            v-model="selectedMonth" 
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          </input>
          <!-- Export Button -->
        <button 
          @click="exportData"
          class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-sm text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
          <DownloadIcon class="mr-2 h-4 w-4" />
          Exportar
        </button>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex justify-between items-center">
        <div class="flex-1 relative">
              <SearchIcon
                class="h-5 w-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Buscar ..."
                class="w-1/2 bg-muted pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
        <!-- Filter by Núcleo -->
        <select 
          v-model="selectedNucleo" 
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los Núcleos</option>
          <option v-for="nucleo in nucleos" :key="nucleo" :value="nucleo">
            {{ nucleo }}
          </option>
        </select>
      </div>

      <!-- Table -->
      <div class="rounded-lg border bg-white shadow-md ">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in headers" :key="header" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in filteredData" :key="item.nucleo">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ item.nucleo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="{ 'text-red-600 font-semibold': item.pto < 3 }">
                {{ item.pto }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                {{ item.acuerdos }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                {{ item.particip }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                {{ item.invitados }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="{ 'text-red-600 font-semibold': item.cp === 0 }">
                {{ item.cp }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                {{ item.cp_agree }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Empty State -->
      <div v-if="data.length === 0" class="text-center py-12">
          <h3 class="mt-2 text-md font-medium text-gray-900">No hay actas</h3>
          <p class="mt-1 text-md text-gray-500">
            Comienza creando una nueva acta o cargando un documento existente.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ComputoService from '@/services/Computo';
import CoreService from '@/services/CoreService';
import { DownloadIcon, SearchIcon } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';

const selectedMonth = ref('2024-12')
const selectedNucleo = ref('')

const headers = [
  'Núcleos',
  'Puntos Orden Día',
  'Total Acuerdos',
  'Particip. Org Sup',
  'Invitados',
  'Círculo Político',
  'Acuerdos C. Político'
]

const data = ref([])

const nucleos = computed(() => {
  return [...new Set(data.value.map(item => item.nucleo))]
})

const filteredData = computed(() => {
  return data.value.filter(item => {
    if (selectedNucleo.value && item.nucleo !== selectedNucleo.value) return false
    return true
  })
})

async function obtenerUsuarios() {
  const service = new ComputoService();
  try {
    const temp = await service.getByDate(12, 2024);
    console.log(temp);
    data.value = temp;
  } catch (error) {
    console.log("error");
  }
}
async function obtenerNucleo(){
  const service = new CoreService();
  try {
    const temp = await service.getCore()
  } catch (error) {
    console.log("error");
  }
}
onMounted(() => {
  obtenerUsuarios();
});

const exportData = () => { //exportar en excel
  const csvContent = [
    headers.join(','),
    ...filteredData.value.map(item => [
      item.nucleo,
      item.puntosOrden,
      item.totalAcuerdos,
      item.particip,
      item.invitados,
      item.circuloPolitico,
      item.acuerdosPolitico
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `kpi_data_${selectedMonth.value}_2024.csv`
  link.click()
}
</script>