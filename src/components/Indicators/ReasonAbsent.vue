<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">Causas de Ausencia</h1>

      <!-- Gráfico de barras -->
      <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 class="text-xl font-semibold mb-4">Distribución de Ausencias</h2>
        <canvas ref="chartRef"></canvas>
      </div>

      <!-- Tabla interactiva -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Detalle de Ausencias</h2>
          <div class="flex justify-between items-center mb-4">
            <input
                v-model="search"
                placeholder="Buscar..."
                class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
                v-model="sortKey"
                @change="sortData"
                class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="codigo">Ordenar por Código</option>
              <option value="descripcion">Ordenar por Descripción</option>
              <option value="cantidad">Ordenar por Cantidad</option>
            </select>
          </div>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="causa in filteredAndSortedCausas" :key="causa.codigo" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ causa.codigo }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ causa.descripcion }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ causa.cantidad }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Chart from 'chart.js/auto'

const causasAusencia = ref([
  { codigo: 'ENF', descripcion: 'Enfermedad', cantidad: 15 },
  { codigo: 'EXT', descripcion: 'Extranjero', cantidad: 5 },
  { codigo: 'TRAB', descripcion: 'Trabajo', cantidad: 8 },
  { codigo: 'FP', descripcion: 'Fuera de Provincia', cantidad: 3 },
  { codigo: 'Vac', descripcion: 'Vacaciones', cantidad: 20 },
  { codigo: 'LM', descripcion: 'Lic. de Maternidad', cantidad: 2 },
  { codigo: 'PP', descripcion: 'Problemas Personales', cantidad: 7 },
  { codigo: 'PF', descripcion: 'Problemas Familiares', cantidad: 4 },
  { codigo: 'Mov', descripcion: 'Movilizado', cantidad: 1 },
  { codigo: 'Inj', descripcion: 'Injustificado', cantidad: 6 },
  { codigo: 'Otr', descripcion: 'Otros', cantidad: 3 },
])

const chartRef = ref(null)
const search = ref('')
const sortKey = ref('codigo')
const sortOrder = ref(1)

const filteredAndSortedCausas = computed(() => {
  return causasAusencia.value
      .filter(causa =>
          causa.codigo.toLowerCase().includes(search.value.toLowerCase()) ||
          causa.descripcion.toLowerCase().includes(search.value.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortKey.value] < b[sortKey.value]) return -1 * sortOrder.value
        if (a[sortKey.value] > b[sortKey.value]) return 1 * sortOrder.value
        return 0
      })
})

const sortData = () => {
  sortOrder.value *= -1
}

onMounted(() => {
  const ctx = chartRef.value.getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: causasAusencia.value.map(causa => causa.codigo),
      datasets: [{
        label: 'Cantidad de Ausencias',
        data: causasAusencia.value.map(causa => causa.cantidad),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Causas'
          }
        }
      }
    }
  })
})
</script>