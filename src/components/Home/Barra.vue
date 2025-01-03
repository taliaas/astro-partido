<template>
  <div class="p-6 bg-white rounded-lg">
    <div class="w-full h-64">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const chartRef = ref(null);

const absenceReasons = ref([
  { label: "Enfermedad", percentage: 25 },
  { label: "Extranjero", percentage: 5 },
  { label: "Trabajo", percentage: 15 },
  { label: "Fuera de Provincia", percentage: 30 },
  { label: "Vacaciones", percentage: 10 },
  { label: "Otros", count: 2, percentage: 15 },
]);

onMounted(() => {
  const ctx = chartRef.value.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: absenceReasons.value.map(reason => reason.label),
      datasets: [{
        label: 'Percentage',
        data: absenceReasons.value.map(reason => reason.percentage),
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue with some transparency
        borderColor: 'rgb(29, 78, 216)', // Darker blue for border
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.parsed.y + '%';
            }
          }
        }
      }
    }
  });
});
</script>