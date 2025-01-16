<template>
  <div class="min-h-screen p-8 dark:bg-zinc-800">
      <!-- Header -->
      <div class="bg-white rounded shadow-md p-4 container mx-auto">
        <div class="p-8  space-y-6">
        <div class="space-y-2">
        <div class="flex justify-between items-center">
          <h2 class="text-lg text-gray-600">CÓMPUTO PARA EL CONTROL DE LAS ACTAS</h2>
          <!-- Month Selector -->
          <div class="flex items-center space-x-4">
            <input type="month"
            v-model="selectedMonth"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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
        <!-- Filter by Núcleo -->
        <select
          v-model="selectedNucleo"
          class="rounded-lg p-2 border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <tr v-for="item in filteredData" :key="item.nucleo.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ item.nucleo.name }}
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
    <div class="space-y-6 m-2 p-2">
      <Card class="mx-10 shadow-md">
        <CardHeader>
          <CardTitle class="font-normal text-lg">Leyenda</CardTitle>
        </CardHeader>
        <CardContent class="">
          <div class="size-2 rounded-full bg-red-500 inline-block"/>
          <h2 class="text-gray-500 inline"> Alerta </h2>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import ComputoService from '@/services/Computo';
import {DownloadIcon, SearchIcon} from 'lucide-vue-next';
import {computed, watch, ref, onMounted} from 'vue';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const selectedMonth = ref('2024-02')
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
const core = ref([])

const nucleos = computed(() => {
  return [...new Set(data.value.map(item => item.nucleo.name))]
})

const filteredData = computed(() => {
  return data.value.filter(item => {
    if (selectedNucleo.value && item.nucleo.name !== selectedNucleo.value) return false
    return true
  })
})

async function obtenerComputo() {
  data.value = null
  const service = new ComputoService();
  const value = selectedMonth.value;
  const [year, month] = value.split('-');
  try {
    data.value = await service.getByDate(month, year);
    console.log(year, month)
  } catch (error) {
    console.log("error");
  }
}

onMounted(()=>{
  obtenerComputo()
})
watch(() => selectedMonth.value, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    obtenerComputo();
  }
})

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