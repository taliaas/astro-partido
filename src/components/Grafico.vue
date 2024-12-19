<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-zinc-800">
    <header class="border-b bg-white">
      <div class="container mx-auto px-4">
        
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div class="mb-8 text-center">
        <h2 class="text-2xl font-medium text-gray-900 dark:text-white">Estado del Funcionamiento PCC CUJAE</h2>
        <p class="text-gray-600 text-lg dark:text-gray-300 font-semibold">Comité UJC CUJAE</p>
      </div>

      <div class="mb-8 rounded-lg border bg-white dark:bg-zinc-800 dark:border-gray-400 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Filtros</h3>
          <button @click="isFilterVisible = !isFilterVisible" class="flex items-center space-x-2 rounded px-4 py-2 text-sm font-medium hover:bg-gray-100">
            <span>{{ isFilterVisible ? "Ocultar filtros" : "Mostrar filtros" }}</span>
            <ChevronDownIcon
              :class="{ 'rotate-180 transform': isFilterVisible }"
              class="h-5 w-5 transition-transform duration-200"
            />          
          </button>
        </div>

        <div class="grid gap-6 md:grid-cols-3" v-show="isFilterVisible">
          <div class="space-y-2">
            <label class="text-md font-medium text-gray-700 dark:text-gray-300">Indicadores</label>
            <select class="w-full rounded-md border border-gray-300 p-2 text-sm">
              <option>Ptos del Orden del Día</option>
              <option>Total de acuerdos</option>
              <option>Indicador C</option>
              <option>Indicador D</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-md font-medium dark:text-gray-300 text-gray-700">Periodo</label>
            <select class="w-full rounded-md border border-gray-300 p-2 text-sm">
              <option>Semestre 1</option>
              <option>Semestre 2</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-md font-medium dark:text-gray-300 text-gray-700">Año</label>
            <input type="number" value="2024" class="w-full rounded-md border border-gray-300 p-2 text-sm" />
          </div>
        </div>
      </div>

      <div class="rounded-lg border bg-white dark:bg-zinc-800 p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">Indicadores para Núcleo 1</h3>
          <button class="inline-flex items-center rounded-md bg-gray-700 dark:bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Exportar
          </button>
        </div>

        <div class="h-[400px] w-full ">
          <LineChart
          class="dark:text-white"
            :data="chartData"
            :options="chartOptions"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line as LineChart } from 'vue-chartjs'
import { ChevronDownIcon } from 'lucide-vue-next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
const isFilterVisible = ref(true)
const chartData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Indicador 1',
      data: [0.65, 0.75, 0.85, 0.80, 0.90, 0.88],
      borderColor: '#3b82f6', // Blue
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Indicador 2',
      data: [0.70, 0.68, 0.82, 0.85, 0.82, 0.95],
      borderColor: '#22c55e', // Green
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 1,
      ticks: {
        stepSize: 0.2
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    }
  }
}
</script>