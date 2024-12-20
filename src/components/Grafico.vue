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
            <select v-model="selectedIndicator" class="w-full rounded-md border border-gray-300 p-2 text-sm">
              <option v-for="indicador in indicadores" :key="indicador.value" :value="indicador.value">{{ indicador.text }}</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label class="text-md font-medium dark:text-gray-300 text-gray-700">Periodo</label>
            <select v-model="selectedPeriod" class="w-full rounded-md border border-gray-300 p-2 text-sm">
              <option value="1">Semestre 1</option>
              <option value="2" >Semestre 2</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-md font-medium dark:text-gray-300 text-gray-700">Año</label>
            <input type="number"  v-model="selectedYear" max="2024"class="w-full rounded-md border border-gray-300 p-2 text-sm" />
          </div>
        </div>
      </div>

      <div class="rounded-lg border bg-white dark:bg-zinc-800 p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">Comportamiento de Indicadores </h3>
          <button @click="exportToPDF" class="inline-flex items-center rounded-md bg-gray-700 dark:bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Exportar
          </button>
        </div>

        <div ref="chartContainer" class="h-[400px] w-full ">
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
import { ref, onMounted, watch } from 'vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,Filler 
} from 'chart.js'
import { Line as LineChart } from 'vue-chartjs'
import { ChevronDownIcon } from 'lucide-vue-next';
import EstadoService from '@/services/EstadoService'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, 
  Filler 
)
const isFilterVisible = ref(true)
const selectedIndicator = ref('order')
const selectedYear = ref(2024)
const selectedPeriod = ref('1')
const chartContainer = ref(null)
import type { ChartData } from 'chart.js'

const chartData = ref<ChartData<'line'>>({ labels: [], datasets: [] })

const indicadores = ref([
  { value: 'order', text: 'Ptos del Orden del Día' },
  { value: 'agreem', text: 'Acuerdos' },
  { value: 'invitados', text: 'Invitados' },
  { value: 'participant', text: 'Participantes' }
])

const selectedIndicatorText = indicadores.value.find(indicador => indicador.value === selectedIndicator.value)?.text || 'N/A';

const fetchData = async () => {
  const months = selectedPeriod.value === '1'
      ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
      : ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const service = new EstadoService()
  try {
    const yearData = await service.getYear(selectedYear.value, selectedIndicator.value)
    const semesterData = selectedPeriod.value === '1' 
      ? yearData[0].slice(0, 6) 
      : yearData[0].slice(6, 12)
      const val = semesterData
      console.log(yearData,semesterData,val);
      chartData.value = {
  labels: months,
  datasets: [
    {
      label: selectedIndicatorText,
      data: semesterData,
      borderColor: '#3b82f6', // Blue
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    },
  ]
}
  } catch (error) {
    console.log(error)
  }
}


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 10,
      ticks: {
        stepSize: 2
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

const exportToPDF = async () => {
  try {
    const canvas = await html2canvas(chartContainer.value)
    const imgData = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF('l', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    
    pdf.text('Estado del Funcionamiento PCC CUJAE', 14, 15)
    
    pdf.text(`Indicador: ${selectedIndicatorText} - Año: ${selectedYear.value} - Semestre: ${selectedPeriod.value}`, 14, 25)
    pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth - 20, pdfHeight - 20)
    
    pdf.save(`estado-funcionamiento-${selectedYear.value}-S${selectedPeriod.value}.pdf`)
  } catch (error) {
    console.error('Error exporting PDF:', error)
  }
}
// Watch for changes in filters
watch([selectedYear, selectedIndicator, selectedPeriod], () => {
  fetchData()
})

// Initial data fetch
onMounted(() => {
  fetchData()
})
</script>