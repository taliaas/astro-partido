<template>
  <Card>
    <CardHeader>
      <CardTitle>Resumen de KPIs</CardTitle>
      <CardDescription>Visualización de los principales indicadores de rendimiento</CardDescription>
    </CardHeader>
    <CardContent class="pl-2">
      <div style="width: 100%; height: 300px;">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Ventas',
      data: [4000, 3000, 2000, 2780, 1890, 2390],
      backgroundColor: 'hsl(var(--primary))',
    },
    {
      label: 'Gastos',
      data: [2400, 1398, 9800, 3908, 4800, 3800],
      backgroundColor: 'hsl(var(--secondary))',
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>