<template>
    <div class="chart-container">
      <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Causas de Ausencia - Mayo 2023</h2>
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
  import { Pie } from 'vue-chartjs';
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  const chartData = ref({
    labels: ['Enfermedad', 'Vacaciones', 'Asuntos personales', 'Formación', 'Otros'],
    datasets: [{
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      data: [12, 19, 3, 5, 2]
    }]
  });
  
  const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + ' días';
            }
            return label;
          }
        }
      }
    }
  });
  
  onMounted(() => {
    // Aquí podrías cargar datos reales si los tuvieras disponibles
    console.log('Componente montado');
  });
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    max-width: 600px;
    height: 400px;
    margin: 0 auto;
  }
  </style>