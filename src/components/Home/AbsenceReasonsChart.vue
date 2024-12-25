<template>
  <div class="w-full h-full flex gap-4">
    <div class="flex-1 h-full">
      <canvas ref="chartRef"></canvas>
    </div>
    <div class="w-48 space-y-2 pr-2 max-h-[300px] overflow-y-auto custom-scrollbar">
      <div
          v-for="reason in absenceReasons"
          :key="reason.label"
          class="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <div
            :style="{ backgroundColor: reason.color }"
            class="w-3 h-3 rounded-full mr-2"
        ></div>
        <div class="flex flex-col">
          <span class="text-sm font-medium">{{ reason.label }}</span>
          <span class="text-xs text-gray-500">{{ reason.percentage }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const chartRef = ref(null)

const absenceReasons = ref([
  { label: "Enfermedad", percentage: 25, color: "#dc2626" },
  { label: "Extranjero", percentage: 5, color: "#2563eb" },
  { label: "Trabajo", percentage: 15, color: "#db2777" },
  { label: "Fuera de Provincia", percentage: 30, color: "#facc15" },
  { label: "Vacaciones", percentage: 10, color: "#16a34a" },
  { label: "Otros", count: 2, percentage: 15, color: "#9333ea" },
])

onMounted(() => {
  const ctx = chartRef.value.getContext('2d')

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: absenceReasons.value.map(reason => reason.label),
      datasets: [{
        data: absenceReasons.value.map(reason => reason.percentage),
        backgroundColor: absenceReasons.value.map(reason => reason.color),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 15,
        borderRadius: 4,
        spacing: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value}%`;
            }
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }
  })
})
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>